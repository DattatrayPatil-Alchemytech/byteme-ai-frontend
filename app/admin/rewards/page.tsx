"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Components
import Overview from "@/components/rewards/Overview";
import StatCard from "@/components/rewards/StatCard";
import DistributeActions from "@/components/rewards/DistributeActions";
import ParticipantsTable from "@/components/rewards/ParticipantsTable";

// Mock data
import { mockCurrentRound, generateMoreSubmissions } from "./mockRewardsData";

const ITEMS_PER_PAGE = 10;

export default function AdminRewardsPage() {
  const router = useRouter();
  const [currentRound] = useState(mockCurrentRound);
  const [isDistributing, setIsDistributing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Stat cards data
  const statCardsData = [
    {
      icon: "🚗",
      title: {
        mobile: "Kilometers",
        desktop: "Total Kilometers",
      },
      value: {
        mobile: `${Math.floor(currentRound.totalKilometers / 1000)}k`,
        desktop: currentRound.totalKilometers.toLocaleString(),
      },
      subtitle: {
        mobile: `Avg: ${currentRound.averageKmPerUser}km`,
        desktop: `Avg: ${currentRound.averageKmPerUser} km/user`,
      },
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: "📊",
      title: {
        mobile: "Submissions",
        desktop: "Total Submissions",
      },
      value: {
        mobile: currentRound.totalSubmissions,
        desktop: currentRound.totalSubmissions,
      },
      subtitle: {
        mobile: "Readings",
        desktop: "Reading submissions",
      },
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: "🌱",
      title: {
        mobile: "CO2 Offset",
        desktop: "Carbon Offset",
      },
      value: {
        mobile: `${Math.floor(currentRound.carbonOffsetTotal / 1000)}k`,
        desktop: currentRound.carbonOffsetTotal.toLocaleString(),
      },
      subtitle: {
        mobile: "kg saved",
        desktop: "kg CO2 saved",
      },
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    },
    {
      icon: "🏆",
      title: {
        mobile: "Top User",
        desktop: "Top Performer",
      },
      value: {
        mobile: `${currentRound.topPerformerKm}km`,
        desktop: `${currentRound.topPerformerKm} km`,
      },
      subtitle: {
        mobile: "Best",
        desktop: "Highest submission",
      },
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Rewards distributed successfully!");
      // Update round status here
    } catch {
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
      <Overview currentRound={currentRound} formatDate={formatDate} />

      {/* Round Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCardsData.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

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
