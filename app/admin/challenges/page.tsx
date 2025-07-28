"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { Plus } from "lucide-react";
import { Challenge } from "../../../lib/apiHelpers/challengesMock";
import {
  getChallengesList,
  deleteChallenge,
  publishChallenge,
  type ChallengesListResponse,
} from "../../../lib/apiHelpers/challenges";
import {
  type ChallengeFilters,
  type PaginationState,
  type ChallengeListParams,
} from "./utils/filterOptions";
import {
  ChallengeFilters as ChallengeFiltersComponent,
  ChallengeCard,
  ChallengeEmptyState,
  ChallengePagination,
  useChallengeTableColumns,
  getDifficultyColor,
  getStatusColor,
  getTypeIcon,
} from "../../../components/challenges";

export default function ChallengesPage() {
  const router = useRouter();

  // State
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

  // API calls
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params: ChallengeListParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };

      const result = await getChallengesList(params);
      const calculatedTotalPages = Math.ceil(result.total / result.limit);
      setChallengesData({
        ...result,
        totalPages: calculatedTotalPages,
      });
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.type,
    filters.status,
    filters.visibility,
    filters.difficulty,
    filters.category,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search.length === 0 || filters.search.length > 3) {
        fetchChallenges();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Event handlers
  const handleEdit = (challenge: Challenge) => {
    router.push(`/admin/challenges/edit/${challenge.id}`);
  };

  const handleView = (challenge: Challenge) => {
    router.push(`/admin/challenges/view/${challenge.id}`);
  };

  const handleDelete = async (challenge: Challenge) => {
    if (confirm("Are you sure you want to delete this challenge?")) {
      try {
        await deleteChallenge(challenge.id);
        alert("Challenge deleted successfully!");
        fetchChallenges();
      } catch (error) {
        console.error("Error deleting challenge:", error);
        alert("Error deleting challenge. Please try again.");
      }
    }
  };

  const handlePublish = async (challenge: Challenge) => {
    if (confirm("Are you sure you want to publish this challenge?")) {
      try {
        await publishChallenge(challenge.id);
        alert("Challenge published successfully!");
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
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  // Table columns
  const columns = useChallengeTableColumns({
    onView: handleView,
    onEdit: handleEdit,
    onPublish: handlePublish,
    onDelete: handleDelete,
    getTypeIcon,
    getDifficultyColor,
    getStatusColor,
  });

  const isEmpty = challengesData.challenges.length === 0 && !loading;

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

      {/* Filters */}
      <ChallengeFiltersComponent
        filters={filters}
        pagination={pagination}
        total={challengesData.total}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onLimitChange={handleLimitChange}
      />

      {/* Desktop DataTable */}
      <div className="hidden md:block">
        {isEmpty ? (
          <ChallengeEmptyState
            filters={filters}
            onResetFilters={handleResetFilters}
            variant="desktop"
          />
        ) : (
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
        )}

        <ChallengePagination
          pagination={pagination}
          totalPages={challengesData.totalPages || 0}
          onPageChange={handlePageChange}
          variant="desktop"
        />
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Challenges</h2>
          <span className="text-sm text-muted-foreground">
            {challengesData.total} total
          </span>
        </div>

        {isEmpty ? (
          <ChallengeEmptyState
            filters={filters}
            onResetFilters={handleResetFilters}
            variant="mobile"
          />
        ) : (
          <div className="space-y-4">
            {challengesData.challenges.map((challenge: Challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onView={handleView}
                onEdit={handleEdit}
                onPublish={handlePublish}
                onDelete={handleDelete}
                getTypeIcon={getTypeIcon}
                getDifficultyColor={getDifficultyColor}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}

        <ChallengePagination
          pagination={pagination}
          totalPages={challengesData.totalPages || 0}
          onPageChange={handlePageChange}
          variant="mobile"
        />
      </div>
    </div>
  );
}
