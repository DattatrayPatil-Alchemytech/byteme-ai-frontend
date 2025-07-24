'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  id: number;
  name: string;
  vehicleModel: string;
  miles: number;
  b3trTokens: number;
}

interface Challenge {
  id: number;
  icon: string;
  title: string;
  description: string;
  status: string;
  participants: number;
  daysLeft: number;
  reward: number;
  duration: string;
  requirements: string[];
  isJoined: boolean;
}

interface LeaderboardProps {
  leaderboard: {
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
  challenges: Challenge[];
  userRank: { rank: number; miles: number };
  onJoinChallenge: (challengeId: number) => void;
}

export default function Leaderboard({ leaderboard, challenges, userRank, onJoinChallenge }: LeaderboardProps) {
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly'>('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-orange-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-orange-400 to-amber-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Period Toggle */}
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActivePeriod('weekly')}
          className={`flex-1 px-4 py-2 rounded-md transition-all ${
            activePeriod === 'weekly'
              ? 'gradient-ev-green text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActivePeriod('monthly')}
          className={`flex-1 px-4 py-2 rounded-md transition-all ${
            activePeriod === 'monthly'
              ? 'gradient-ev-green text-white shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Monthly
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard */}
        <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <span className="text-2xl mr-2">📈</span>
              {activePeriod === 'weekly' ? 'Weekly' : 'Monthly'} Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard[activePeriod].map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    entry.name === 'John Doe'
                      ? 'gradient-ev-green/20 border border-primary/30'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(index + 1)} flex items-center justify-center text-sm font-bold text-white`}>
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.vehicleModel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-semibold">{entry.miles} miles</p>
                    <p className="text-xs text-primary">+{entry.b3trTokens} B3TR</p>
                  </div>
                </div>
              ))}
            </div>

            {/* User Rank */}
            <div className="mt-6 p-4 gradient-ev-light/20 rounded-lg border border-success/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">Your Rank</p>
                  <p className="text-sm text-muted-foreground">#{userRank.rank} • {userRank.miles} miles</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">+{Math.floor(userRank.miles * 0.5)} B3TR</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-4 bg-white/50 rounded-lg border border-white/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <h4 className="text-foreground font-semibold">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-bold">+{challenge.reward} B3TR</div>
                      <div className="text-xs text-muted-foreground">{challenge.daysLeft} days left</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="gradient-ev-green h-2 rounded-full" style={{ width: `${(challenge.participants / 50) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
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
                        ? 'bg-success/20 text-success border-success/30'
                        : 'gradient-ev-green hover:from-emerald-600 hover:to-green-700'
                    }`}
                    size="sm"
                  >
                    {challenge.isJoined ? 'Joined ✓' : 'Join Challenge'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 