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
        {/* Leaderboard */}
        <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <span className="text-2xl mr-2">📈</span>
              Weekly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 w-full">
                <span className="text-5xl mb-4">📉</span>
                <p className="text-lg font-semibold text-muted-foreground mb-2">No leaderboard data yet</p>
                <p className="text-sm text-muted-foreground mb-4">Be the first to participate and climb the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.entries.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      entry.rank === data.userRank
                        ? "gradient-ev-green/20 border border-primary/30"
                        : "bg-card/50 hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(
                          entry.rank
                        )} flex items-center justify-center text-sm font-bold text-white`}
                      >
                        {getRankIcon(entry.rank)}
                      </div>
                      <div>
                        <p className="text-foreground font-medium">
                          {entry.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.walletAddress}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">
                        {entry.totalMileage} miles
                      </p>
                      <p className="text-xs text-primary">
                        +{entry.totalRewards} B3TR
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Always show user rank and total participants cards below */}
            {(data.userRank && data.userRank > 0) || (data.totalParticipants && data.totalParticipants > 0) ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-center mt-8 w-full max-w-xs mx-auto">
                {data.userRank && data.userRank > 0 && (
                  <div className="bg-muted/60 rounded-lg px-4 py-2 text-center w-full">
                    <span className="text-sm text-muted-foreground">Your Rank</span>
                    <div className="text-xl font-bold text-primary">#{data.userRank}</div>
                  </div>
                )}
                {data.totalParticipants && data.totalParticipants > 0 && (
                  <div className="bg-muted/60 rounded-lg px-4 py-2 text-center w-full">
                    <span className="text-sm text-muted-foreground">Total Participants</span>
                    <div className="text-xl font-bold text-success">{data.totalParticipants}</div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
        {/* Challenges section remains unchanged or can be removed if not needed */}
        {/* Challenges */}
        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-4 bg-card/50 rounded-lg border border-border/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <h4 className="text-foreground font-semibold">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-bold">
                        +{challenge.reward} B3TR
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {challenge.daysLeft} days left
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="gradient-ev-green h-2 rounded-full"
                        style={{
                          width: `${(challenge.participants / 50) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Requirements:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-primary mr-2">•</span>
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
                        ? "bg-success/20 text-success border-success/30"
                        : "gradient-ev-green hover:from-emerald-600 hover:to-green-700"
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
