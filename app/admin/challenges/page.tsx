"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable, Column, Action } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Target,
  Search,
  Filter,
  RotateCcw,
  Send,
} from "lucide-react";
import { Challenge } from "../../../lib/apiHelpers/challengesMock";
import {
  getChallengesList,
  deleteChallenge,
  publishChallenge,
  ChallengesListResponse,
} from "../../../lib/apiHelpers/challenges";
import {
  challengeTypes,
  challengeStatuses,
  challengeVisibilities,
  challengeDifficulties,
  ChallengeFilters,
  PaginationState,
  ChallengeListParams,
} from "./utils/filterOptions";

export default function ChallengesPage() {
  const router = useRouter();

  // Filter and pagination state
  const [filters, setFilters] = useState<ChallengeFilters>({
    search: "",
    type: "",
    status: "",
    visibility: "",
    difficulty: "",
    category: "",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [challengesData, setChallengesData] = useState<ChallengesListResponse>({
    challenges: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);

  // Fetch challenges
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params: ChallengeListParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const result = await getChallengesList(params);
      setChallengesData(result);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch challenges when non-search filters or pagination change
  useEffect(() => {
    fetchChallenges();
  }, [
    filters.type,
    filters.status,
    filters.visibility,
    filters.difficulty,
    filters.category,
    pagination.page,
    pagination.limit,
  ]);

  // Debounced search effect - only search when string is more than 3 characters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search.length === 0 || filters.search.length > 3) {
        fetchChallenges();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleEdit = (challenge: Record<string, unknown>) => {
    router.push(`/admin/challenges/edit/${challenge.id as number}`);
  };

  const handleView = (challenge: Record<string, unknown>) => {
    router.push(`/admin/challenges/view/${challenge.id as number}`);
  };

  const handleDelete = async (challenge: Record<string, unknown>) => {
    if (confirm("Are you sure you want to delete this challenge?")) {
      try {
        await deleteChallenge(challenge.id as number);
        alert("Challenge deleted successfully!");
        // Refetch challenges to update the list
        fetchChallenges();
      } catch (error) {
        console.error("Error deleting challenge:", error);
        alert("Error deleting challenge. Please try again.");
      }
    }
  };

  const handlePublish = async (challenge: Record<string, unknown>) => {
    if (confirm("Are you sure you want to publish this challenge?")) {
      try {
        await publishChallenge(challenge.id as number);
        alert("Challenge published successfully!");
        // Refetch challenges to update the list with current filters and pagination
        fetchChallenges();
      } catch (error) {
        console.error("Error publishing challenge:", error);
        alert("Error publishing challenge. Please try again.");
      }
    }
  };

  const handleCreateChallenge = () => {
    router.push("/admin/challenges/create");
  };

  const handleFilterChange = (key: keyof ChallengeFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      type: "",
      status: "",
      visibility: "",
      difficulty: "",
      category: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mileage":
        return "🚗";
      case "carbon-saved":
        return "🌱";
      case "upload":
        return "📸";
      case "streak":
        return "🔥";
      case "vehicle-count":
        return "🚛";
      default:
        return "🎯";
    }
  };

  // Define columns for the DataTable
  const columns: Column[] = [
    {
      key: "imageUrl",
      label: "Image",
      width: "100px",
      render: (value) => (
        <Image
          src={value as string}
          alt="Challenge"
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "name",
      label: "Challenge",
      render: (value, row) => (
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(row.type as string)}</span>
            <div className="font-medium text-foreground">{value as string}</div>
            {row.metadata && (row.metadata as any).featured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate max-w-xs">
            {row.description as string}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={getDifficultyColor(row.difficulty as string)}>
              {row.difficulty as string}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {row.type as string}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "rewards",
      label: "Rewards",
      render: (value) => {
        const rewards = value as Challenge["rewards"];
        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">🪙</span>
              <span>{rewards.b3trTokens} B3TR</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⭐</span>
              <span>{rewards.points} pts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">📈</span>
              <span>{rewards.experience} XP</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "participants",
      label: "Participants",
      render: (value, row) => {
        const current = row.currentParticipants as number;
        const max = row.maxParticipants as number;
        const percentage = (current / max) * 100;
        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>
                {current}/{max}
              </span>
            </div>
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "dates",
      label: "Duration",
      render: (value, row) => {
        const startDate = new Date(row.startDate as string);
        const endDate = new Date(row.endDate as string);
        const now = new Date();
        const isActive = now >= startDate && now <= endDate;
        const isUpcoming = now < startDate;
        const isExpired = now > endDate;

        return (
          <div className="text-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`text-xs ${
                isActive
                  ? "border-green-500 text-green-600"
                  : isUpcoming
                  ? "border-blue-500 text-blue-600"
                  : "border-red-500 text-red-600"
              }`}
            >
              {isActive ? "Active" : isUpcoming ? "Upcoming" : "Expired"}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "objectives",
      label: "Objectives",
      render: (value) => {
        const objectives = value as Challenge["objectives"];
        return (
          <div className="text-sm space-y-1">
            {objectives.mileage && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.mileage} km</span>
              </div>
            )}
            {objectives.uploadCount && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.uploadCount} uploads</span>
              </div>
            )}
            {objectives.streakDays && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.streakDays} day streak</span>
              </div>
            )}
            {objectives.socialShares && (
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-muted-foreground" />
                <span>{objectives.socialShares} shares</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge className={getStatusColor(value as string)}>
          {value as string}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {row.status === "draft" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePublish(row)}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Define actions for the DataTable
  const actions: Action[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
      variant: "ghost",
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "ghost",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "ghost",
      className: "text-red-600 hover:text-red-700 hover:bg-red-50",
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Challenges
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and manage user challenges
          </p>
        </div>
        <Button
          onClick={handleCreateChallenge}
          className="gradient-ev-green hover-glow w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <Label htmlFor="type" className="text-sm font-medium mb-2 block">
              Type
            </Label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Types</option>
              {challengeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium mb-2 block">
              Status
            </Label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Statuses</option>
              {challengeStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility Filter */}
          <div>
            <Label
              htmlFor="visibility"
              className="text-sm font-medium mb-2 block"
            >
              Visibility
            </Label>
            <select
              id="visibility"
              value={filters.visibility}
              onChange={(e) => handleFilterChange("visibility", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Visibility</option>
              {challengeVisibilities.map((visibility) => (
                <option key={visibility.value} value={visibility.value}>
                  {visibility.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <Label
              htmlFor="difficulty"
              className="text-sm font-medium mb-2 block"
            >
              Difficulty
            </Label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Difficulties</option>
              {challengeDifficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, challengesData.total)}{" "}
            of {challengesData.total} challenges
          </p>

          {/* Items per page */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="limit" className="text-sm font-medium">
              Per page:
            </Label>
            <select
              id="limit"
              value={pagination.limit}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: Number(e.target.value),
                  page: 1,
                }))
              }
              className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop DataTable */}
      <div className="hidden md:block">
        <DataTable
          data={
            challengesData.challenges as unknown as Record<string, unknown>[]
          }
          columns={columns}
          title="Challenge List"
          searchable={false}
          pagination={false}
          emptyMessage="No challenges found"
        />

        {/* Custom Pagination */}
        {challengesData.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {challengesData.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from(
                  {
                    length: Math.min(5, challengesData.totalPages),
                  },
                  (_, i) => {
                    const pageNum = pagination.page - 2 + i;
                    if (pageNum < 1 || pageNum > challengesData.totalPages)
                      return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === challengesData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Challenges</h2>
          <span className="text-sm text-muted-foreground">
            {challengesData.total} total
          </span>
        </div>

        <div className="space-y-4">
          {challengesData.challenges.map((challenge: Challenge) => {
            const startDate = new Date(challenge.startDate);
            const endDate = new Date(challenge.endDate);
            const now = new Date();
            const isActive = now >= startDate && now <= endDate;
            const isUpcoming = now < startDate;
            const participationPercentage =
              (challenge.currentParticipants / challenge.maxParticipants) * 100;

            return (
              <div
                key={challenge.id}
                className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-4"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <Image
                    src={challenge.imageUrl}
                    alt={challenge.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">
                        {getTypeIcon(challenge.type)}
                      </span>
                      <h3 className="font-semibold text-foreground truncate">
                        {challenge.name}
                      </h3>
                      {challenge.metadata.featured && (
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {challenge.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge
                        className={getDifficultyColor(challenge.difficulty)}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {challenge.type}
                      </Badge>
                      <Badge className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isActive
                            ? "border-green-500 text-green-600"
                            : isUpcoming
                            ? "border-blue-500 text-blue-600"
                            : "border-red-500 text-red-600"
                        }`}
                      >
                        {isActive
                          ? "Active"
                          : isUpcoming
                          ? "Upcoming"
                          : "Expired"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-600">🪙</span>
                    <span>{challenge.rewards.b3trTokens}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600">⭐</span>
                    <span>{challenge.rewards.points}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600">📈</span>
                    <span>{challenge.rewards.experience}</span>
                  </div>
                </div>

                {/* Participation Progress */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">
                      Participants
                    </span>
                    <span className="text-xs font-medium">
                      {challenge.currentParticipants}/
                      {challenge.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(participationPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Objectives */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {challenge.objectives.mileage && (
                      <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                        <Target className="w-3 h-3" />
                        <span>{challenge.objectives.mileage} km</span>
                      </div>
                    )}
                    {challenge.objectives.uploadCount && (
                      <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                        <Target className="w-3 h-3" />
                        <span>{challenge.objectives.uploadCount} uploads</span>
                      </div>
                    )}
                    {challenge.objectives.streakDays && (
                      <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                        <Target className="w-3 h-3" />
                        <span>{challenge.objectives.streakDays} days</span>
                      </div>
                    )}
                    {challenge.objectives.socialShares && (
                      <div className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded">
                        <Target className="w-3 h-3" />
                        <span>{challenge.objectives.socialShares} shares</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleView({ id: challenge.id })}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit({ id: challenge.id })}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete({ id: challenge.id })}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Pagination */}
        {challengesData.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-4 p-4 bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {challengesData.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  {
                    length: Math.min(3, challengesData.totalPages),
                  },
                  (_, i) => {
                    const pageNum = pagination.page - 1 + i;
                    if (pageNum < 1 || pageNum > challengesData.totalPages)
                      return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === challengesData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
