import React, { useEffect, useState } from "react";
import {
  getWeeklyLeaderboard,
  type LeaderboardResponse,
} from "@/lib/apiHelpers/userDashboard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const LeaderboardRanking: React.FC = () => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setLoading(true);
    console.log("🔍 Starting to fetch leaderboard data...");
    getWeeklyLeaderboard()
      .then((res) => {
        console.log("✅ Leaderboard API response:", res);
        console.log("📊 Leaderboard entries count:", res?.entries?.length || 0);
        console.log("👥 Total participants:", res?.totalParticipants || 0);
        setData(res);
      })
      .catch((err) => {
        console.error("❌ Failed to load leaderboard:", err);
        console.error("🔧 Error details:", {
          message: err.message,
          status: err.status,
          data: err.data,
        });
        setData(null);
        toast.error(
          `Failed to load leaderboard: ${err.message || "Unknown error"}`
        );
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm order-2 lg:order-1">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-card/50 animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 opacity-40" />
                  <div>
                    <div className="h-4 w-24 bg-muted rounded mb-1" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-16 bg-muted rounded mb-1" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="py-8 text-center text-red-500">
        No leaderboard data available.
      </div>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/50 order-2 lg:order-1">
      <CardHeader className="border-b border-border/30 dark:border-slate-700/30">
        <CardTitle className="text-foreground dark:text-white flex items-center text-xl">
          <span className="text-2xl mr-3">📈</span>
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Main Leaderboard List */}
        <div className="p-6">
          {data.entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-5xl mb-4">📉</span>
              <p className="text-lg font-semibold text-muted-foreground dark:text-slate-300 mb-2">
                No leaderboard data yet
              </p>
              <p className="text-sm text-muted-foreground dark:text-slate-400 text-center">
                Be the first to participate and climb the leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.entries.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    entry.rank === data.userRank
                      ? "bg-primary/10 border border-primary/30 dark:bg-slate-700/50 dark:border-slate-600/50"
                      : "bg-muted/30 hover:bg-muted/50 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(
                        entry.rank
                      )} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
                    >
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <p className="text-foreground dark:text-white font-semibold text-base">
                        {entry.username}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground dark:text-slate-400">
                            📊
                          </span>
                          <span className="text-xs text-muted-foreground dark:text-slate-400">
                            {entry.totalPoints} pts
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground dark:text-slate-400">
                            🌱
                          </span>
                          <span className="text-xs text-muted-foreground dark:text-slate-400">
                            {entry.totalCarbonSaved} CO₂
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground dark:text-white font-bold text-base">
                      {entry.totalMileage} miles
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      +{entry.totalRewards} B3TR
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Cards Section */}
        <div className="border-t border-border/30 dark:border-slate-700/30 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Your Rank Card */}
            <div className="bg-muted/50 dark:bg-slate-700/50 rounded-xl p-4 text-center min-w-[140px] border border-border/30 dark:border-slate-600/30">
              <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">
                Your Rank
              </p>
              <div className="text-2xl font-bold text-primary dark:text-green-400">
                {data.userRank && data.userRank > 0
                  ? `#${data.userRank}`
                  : `#${
                      data?.entries?.find((entry) => entry.userId === user?.id)
                        ?.rank
                    }`}
              </div>
            </div>

            {/* Total Participants Card */}
            <div className="bg-muted/50 dark:bg-slate-700/50 rounded-xl p-4 text-center min-w-[140px] border border-border/30 dark:border-slate-600/30">
              <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">
                Total Participants
              </p>
              <div className="text-2xl font-bold text-foreground dark:text-white">
                {data.totalParticipants || 0}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardRanking;
