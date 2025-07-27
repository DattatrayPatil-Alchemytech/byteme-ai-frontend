"use client";

import React, { useEffect, useState } from "react";
import {
  getWeeklyLeaderboard,
  type LeaderboardResponse,
  type LeaderboardEntry,
} from "@/lib/apiHelpers/userDashboard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockChallenges = [
  {
    id: 1,
    icon: "🏆",
    title: "Weekly Mileage Challenge",
    description: "Drive the most miles this week",
    status: "active",
    participants: 45,
    daysLeft: 3,
    reward: 100,
    duration: "7 days",
    requirements: [
      "Drive at least 50 miles",
      "Use eco-driving mode",
      "Complete 5 trips",
    ],
    isJoined: true,
  },
  {
    id: 2,
    icon: "🌱",
    title: "Eco Warrior Challenge",
    description: "Maintain 90%+ eco-driving score",
    status: "active",
    participants: 32,
    daysLeft: 7,
    reward: 75,
    duration: "14 days",
    requirements: [
      "Maintain eco-driving score above 90%",
      "Complete 10 trips",
      "Use regenerative braking",
    ],
    isJoined: false,
  },
];

const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getWeeklyLeaderboard()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError("Failed to load leaderboard");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard Skeleton */}
          <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
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
          {/* Challenges Skeleton (optional, keep as is or add skeleton if needed) */}
          <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="p-4 bg-card/50 rounded-lg border border-border/20 animate-pulse">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded bg-muted" />
                      <div>
                        <div className="h-4 w-32 bg-muted rounded mb-1" />
                        <div className="h-3 w-40 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded mb-2" />
                    <div className="h-2 w-1/2 bg-muted rounded mb-2" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="py-8 text-center text-red-500">
        No leaderboard data available.
      </div>
    );
  }

  // Helper functions for rank icon/color (unchanged)
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

  const onJoinChallenge = (challengeId: number) => {
    // Implement join logic or just log for now
    console.log("Joining challenge:", challengeId);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard - First on desktop, second on mobile/tablet */}
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
                  <p className="text-lg font-semibold text-muted-foreground dark:text-slate-300 mb-2">No leaderboard data yet</p>
                  <p className="text-sm text-muted-foreground dark:text-slate-400 text-center">Be the first to participate and climb the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.entries.map((entry, index) => (
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
                              <span className="text-muted-foreground dark:text-slate-400">📊</span>
                              <span className="text-xs text-muted-foreground dark:text-slate-400">{entry.totalPoints} pts</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-muted-foreground dark:text-slate-400">🌱</span>
                              <span className="text-xs text-muted-foreground dark:text-slate-400">{entry.totalCarbonSaved} CO₂</span>
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
                  <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">Your Rank</p>
                  <div className="text-2xl font-bold text-primary dark:text-green-400">
                    {data.userRank && data.userRank > 0 ? `#${data.userRank}` : '#'}
                  </div>
                </div>

                {/* Total Participants Card */}
                <div className="bg-muted/50 dark:bg-slate-700/50 rounded-xl p-4 text-center min-w-[140px] border border-border/30 dark:border-slate-600/30">
                  <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2">Total Participants</p>
                  <div className="text-2xl font-bold text-foreground dark:text-white">
                    {data.totalParticipants || 0}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenges - Second on desktop, first on mobile/tablet */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/50 order-1 lg:order-2">
          <CardHeader className="border-b border-border/30 dark:border-slate-700/30">
            <CardTitle className="text-foreground dark:text-white flex items-center text-xl">
              <span className="text-2xl mr-3">🎯</span>
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 bg-muted/30 dark:bg-slate-700/30 rounded-xl border border-border/30 dark:border-slate-600/30 hover:bg-muted/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <h4 className="text-foreground dark:text-white font-semibold">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-slate-400">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 dark:text-green-400 font-bold">
                        +{challenge.reward} B3TR
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-slate-400">
                        {challenge.daysLeft} days left
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400 mb-2">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="w-full bg-muted dark:bg-slate-600/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 h-2 rounded-full"
                        style={{
                          width: `${(challenge.participants / 50) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground dark:text-slate-400 mb-2">
                      Requirements:
                    </p>
                    <ul className="text-xs text-muted-foreground dark:text-slate-400 space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => onJoinChallenge(challenge.id)}
                    disabled={challenge.isJoined}
                    className={`w-full ${
                      challenge.isJoined
                        ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white"
                    }`}
                    size="sm"
                  >
                    {challenge.isJoined ? "Joined ✓" : "Join Challenge"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
