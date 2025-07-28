"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Components
import Overview from "@/components/rewards/Overview";
import StatCard from "@/components/rewards/StatCard";
import DistributeActions from "@/components/rewards/DistributeActions";
import ParticipantsTable from "@/components/rewards/ParticipantsTable";

// API helpers
import { getRewardsStats, RewardsStats } from "../../../lib/apiHelpers/rewards";

// Mock data
import { mockCurrentRound, generateMoreSubmissions } from "./mockRewardsData";

const ITEMS_PER_PAGE = 10;

export default function AdminRewardsPage() {
  const router = useRouter();
  const [currentRound] = useState(mockCurrentRound);
  const [isDistributing, setIsDistributing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rewardsStats, setRewardsStats] = useState<RewardsStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch rewards stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("📈 Starting to fetch rewards stats...");
        const stats = await getRewardsStats();
        console.log("✅ Rewards stats API response:", stats);
        console.log("💰 Total amount:", stats?.totalAmount || 0);
        console.log("🏃 Total participants:", stats?.total || 0);
        setRewardsStats(stats);
      } catch (error) {
        console.error("❌ Error fetching rewards stats:", error);
        console.error("🔧 Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          status: (error as any)?.status || "Unknown status",
          data: (error as any)?.data || null,
        });
        toast.error("Failed to load rewards statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate mock submissions
  const allSubmissions = generateMoreSubmissions(112);

  // Pagination logic
  const totalPages = Math.ceil(allSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSubmissions = allSubmissions.slice(startIndex, endIndex);

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stat cards data using API data
  const statCardsData = rewardsStats
    ? [
        {
          icon: "🚗",
          title: {
            mobile: "Miles",
            desktop: "Total Miles",
          },
          value: {
            mobile: `${Math.floor((rewardsStats.totalMiles || 0) / 1000)}k`,
            desktop: (rewardsStats.totalMiles || 0).toLocaleString(),
          },
          subtitle: {
            mobile: `Avg: ${rewardsStats.averageMiles || 0}mi`,
            desktop: `Avg: ${rewardsStats.averageMiles || 0} miles/user`,
          },
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
          icon: "💰",
          title: {
            mobile: "Rewards",
            desktop: "Total Rewards",
          },
          value: {
            mobile: `$${Math.floor(rewardsStats.totalAmount || 0)}`,
            desktop: `$${(rewardsStats.totalAmount || 0).toLocaleString()}`,
          },
          subtitle: {
            mobile: `Avg: $${rewardsStats.averageAmount || 0}`,
            desktop: `Avg: $${rewardsStats.averageAmount || 0}/user`,
          },
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
          icon: "🌱",
          title: {
            mobile: "CO2 Saved",
            desktop: "Carbon Saved",
          },
          value: {
            mobile: `${Math.floor(
              (rewardsStats.totalCarbonSaved || 0) / 1000
            )}k`,
            desktop: (rewardsStats.totalCarbonSaved || 0).toLocaleString(),
          },
          subtitle: {
            mobile: `Avg: ${(rewardsStats.averageCarbonSaved || 0).toFixed(
              1
            )}kg`,
            desktop: `Avg: ${(rewardsStats.averageCarbonSaved || 0).toFixed(
              1
            )} kg/user`,
          },
          color: "text-emerald-600",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
        },
        {
          icon: "📈",
          title: {
            mobile: "Active Day",
            desktop: "Most Active Day",
          },
          value: {
            mobile: `${rewardsStats.mostActiveDayCount || 0}`,
            desktop: `${rewardsStats.mostActiveDayCount || 0} rewards`,
          },
          subtitle: {
            mobile: rewardsStats.mostActiveDay
              ? formatDate(rewardsStats.mostActiveDay)
              : "N/A",
            desktop: rewardsStats.mostActiveDay
              ? formatDate(rewardsStats.mostActiveDay)
              : "N/A",
          },
          color: "text-orange-600",
          bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
      ]
    : [];

  // Helper functions
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-orange-500";
      case 2:
        return "from-gray-300 to-gray-400";
      case 3:
        return "from-orange-400 to-amber-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  // Action handlers
  const handleDistributeRewards = async () => {
    setIsDistributing(true);
    try {
      console.log("💰 Starting to distribute rewards...");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("✅ Rewards distributed successfully!");
      toast.success("Rewards distributed successfully!");
      // Update round status here
    } catch (error) {
      console.error("❌ Error distributing rewards:", error);
      console.error("🔧 Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        status: (error as any)?.status || "Unknown status",
        data: (error as any)?.data || null,
      });
      toast.error("Failed to distribute rewards");
    } finally {
      setIsDistributing(false);
    }
  };

  const handleStartNewRound = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("New round started successfully!");
      // Update round data here
    } catch {
      toast.error("Failed to start new round");
    }
  };

  const handleViewUserDetails = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Rewards Distribution 🎯
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage current round rewards and distribute B3TR tokens to
          participants.
        </p>
      </div>

      {/* Overview */}
      <Overview
        rewardsStats={rewardsStats}
        loading={loading}
        formatDate={formatDate}
      />

      {/* Round Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          : statCardsData.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
      </div>

      {/* Detailed Stats Breakdown */}
      {!loading && rewardsStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* By Type */}
          <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              By Type
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Upload
                </span>
                <span className="font-medium text-foreground">
                  {rewardsStats?.byType?.upload || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Badge
                </span>
                <span className="font-medium text-foreground">
                  {rewardsStats?.byType?.badge || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Challenge
                </span>
                <span className="font-medium text-foreground">
                  {rewardsStats?.byType?.challenge || 0}
                </span>
              </div>
            </div>
          </div>

          {/* By Status */}
          <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              By Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-yellow-600">
                  {rewardsStats?.byStatus?.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium text-green-600">
                  {rewardsStats?.byStatus?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium text-red-600">
                  {rewardsStats?.byStatus?.failed || 0}
                </span>
              </div>
            </div>
          </div>

          {/* By Blockchain Status */}
          <div className="bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <span className="text-2xl mr-2">⛓️</span>
              Blockchain Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Not Sent</span>
                <span className="font-medium text-orange-600">
                  {rewardsStats?.byBlockchainStatus?.not_sent || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confirmed</span>
                <span className="font-medium text-green-600">
                  {rewardsStats?.byBlockchainStatus?.confirmed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Failed</span>
                <span className="font-medium text-red-600">
                  {rewardsStats?.byBlockchainStatus?.failed || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Actions */}
      <DistributeActions
        currentRound={currentRound}
        isDistributing={isDistributing}
        handleDistributeRewards={handleDistributeRewards}
        handleStartNewRound={handleStartNewRound}
      />

      {/* Participants Table */}
      <ParticipantsTable
        allSubmissions={allSubmissions}
        currentSubmissions={currentSubmissions}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleViewUserDetails={handleViewUserDetails}
        getRankColor={getRankColor}
        getRankIcon={getRankIcon}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}
