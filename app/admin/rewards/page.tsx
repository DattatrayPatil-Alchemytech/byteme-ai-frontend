"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  getRewards,
  getRewardsStats,
  type RewardsStats,
} from "@/lib/apiHelpers/rewards";
import { DistributeActions } from "@/components/rewards";
import { format } from "date-fns";
import { StatCard } from "@/components/rewards";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

interface Reward {
  status: string;
  blockchainStatus: string;
  amount: string;
  milesDriven: string;
  carbonSaved: string;
  cycleId: string | null;
  blockchainData: {
    txHash: {
      txid: string;
      totalDistributed: string;
      batchCount: number;
      totalUsers: number;
    };
    sentAt: string;
  };
  processedAt: string;
  confirmedAt: string;
  typeIcon: string;
  statusColor: string;
  blockchainStatusColor: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [rewardsStats, setRewardsStats] = useState<RewardsStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rewardsResponse, statsResponse] = await Promise.all([
          getRewards(),
          getRewardsStats(),
        ]);
        setRewards(rewardsResponse.rewards);
        setRewardsStats(statsResponse);
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600 dark:text-green-400";
      case "yellow":
        return "text-yellow-600 dark:text-yellow-400";
      case "red":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const explorerUrl =
    process.env.NEXT_PUBLIC_VECHAIN_EXPLORER_URL ||
    "https://explore-testnet.vechain.org/";

  // Format date for stats display
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
            desktop: (rewardsStats.totalMiles || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          },
          subtitle: {
            mobile: `Avg: ${(rewardsStats.averageMiles || 0).toFixed(2)}mi`,
            desktop: `Avg: ${(rewardsStats.averageMiles || 0).toFixed(
              2
            )} miles/user`,
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
            desktop: `$${(rewardsStats.totalAmount || 0).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            )}`,
          },
          subtitle: {
            mobile: `Avg: $${(rewardsStats.averageAmount || 0).toFixed(2)}`,
            desktop: `Avg: $${(rewardsStats.averageAmount || 0).toFixed(
              2
            )}/user`,
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
            desktop: (rewardsStats.totalCarbonSaved || 0).toLocaleString(
              undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            ),
          },
          subtitle: {
            mobile: `Avg: ${(rewardsStats.averageCarbonSaved || 0).toFixed(
              2
            )}kg`,
            desktop: `Avg: ${(rewardsStats.averageCarbonSaved || 0).toFixed(
              2
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Rewards Management</h1>
          <p className="text-muted-foreground">
            Manage and track rewards distribution and blockchain transactions
          </p>
        </div>
        <DistributeActions />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? // Loading skeleton for stat cards
            [...Array(4)].map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </Card>
            ))
          : statCardsData.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
      </div>

      {/* Detailed Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        rewardsStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* By Type */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                By Type
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Upload
                  </span>
                  <span className="font-medium">
                    {(rewardsStats?.byType?.upload || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Badge
                  </span>
                  <span className="font-medium">
                    {(rewardsStats?.byType?.badge || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Challenge
                  </span>
                  <span className="font-medium">
                    {(rewardsStats?.byType?.challenge || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* By Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                By Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-yellow-600">
                    {(rewardsStats?.byStatus?.pending || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-green-600">
                    {(rewardsStats?.byStatus?.completed || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-medium text-red-600">
                    {(rewardsStats?.byStatus?.failed || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* By Blockchain Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">⛓️</span>
                Blockchain Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Not Sent</span>
                  <span className="font-medium text-orange-600">
                    {(
                      rewardsStats?.byBlockchainStatus?.not_sent || 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Confirmed</span>
                  <span className="font-medium text-green-600">
                    {(
                      rewardsStats?.byBlockchainStatus?.confirmed || 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-medium text-red-600">
                    {(
                      rewardsStats?.byBlockchainStatus?.failed || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )
      )}

      {/* Rewards Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Rewards</h3>
        {loading ? (
          <div className="space-y-4">
            <div className="w-full grid grid-cols-7 gap-4 mb-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, j) => (
                  <div
                    key={j}
                    className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Blockchain Status</th>
                  <th className="text-left p-3">Amount (BTR)</th>
                  <th className="text-left p-3">Miles Driven</th>
                  <th className="text-left p-3">Carbon Saved</th>
                  <th className="text-left p-3">Processed At</th>
                  <th className="text-left p-3">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span>{reward.typeIcon}</span>
                        <span className={getStatusColor(reward.statusColor)}>
                          {reward.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={getStatusColor(reward.blockchainStatusColor)}
                      >
                        {reward.blockchainStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {parseFloat(reward.amount).toFixed(2)}
                    </td>
                    <td className="p-3">
                      {parseFloat(reward.milesDriven).toFixed(2)}
                    </td>
                    <td className="p-3">
                      {parseFloat(reward.carbonSaved).toFixed(2)}
                    </td>
                    <td className="p-3">
                      {format(
                        new Date(reward.processedAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </td>
                    <td className="p-3">
                      {reward.blockchainData?.txHash?.txid ? (
                        <a
                          href={`${explorerUrl}transactions/${reward.blockchainData.txHash.txid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {`${reward.blockchainData.txHash.txid.slice(
                            0,
                            6
                          )}...${reward.blockchainData.txHash.txid.slice(-4)}`}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
