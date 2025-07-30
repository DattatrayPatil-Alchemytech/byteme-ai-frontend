import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  getUserChallenges,
  getAvailableChallenges,
  joinActiveChallenge,
  type UserChallenge,
} from "@/lib/apiHelpers/challenges";

const ChallengeSection: React.FC = () => {
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoadingChallenges(true);
      try {
        // First try to get user's challenges
        const userChallengesRes = await getUserChallenges();
        if (userChallengesRes?.userChallenges?.length > 0) {
          const userChallenges = userChallengesRes.userChallenges.map(
            ({ challenge }) => ({
              ...challenge,
              joined: true,
            })
          );
          // If user has challenges, show them with joined status
          setChallenges(userChallenges);
          setShowAvailable(false);
        } else {
          // If no user challenges, get available challenges
          const availableChallenges = await getAvailableChallenges();
          setChallenges(availableChallenges?.challenges || []);
          setShowAvailable(true);
        }
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
        toast.error("Failed to load challenges");
        setChallenges([]);
      } finally {
        setLoadingChallenges(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleJoin = async (challenge: UserChallenge) => {
    if (!challenge.id) {
      toast.error("Invalid challenge");
      return;
    }

    try {
      await joinActiveChallenge(challenge.id);
      toast.success("Successfully joined challenge!");

      // Update the challenge to show as joined
      setChallenges((prev) =>
        prev.map((c) => (c.id === challenge.id ? { ...c, joined: true } : c))
      );

      // Optionally, refetch user challenges to get updated list
      const userChallengesRes = await getUserChallenges();
      if (userChallengesRes?.userChallenges?.length > 0) {
        setChallenges(
          userChallengesRes.userChallenges.map(
            ({ challenge }: { challenge: UserChallenge }) => ({
              ...challenge,
              joined: true,
            })
          )
        );
        setShowAvailable(false);
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast.error("Failed to join challenge");
    }
  };

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700/50 order-1 lg:order-2">
      <CardHeader className="border-b border-border/30 dark:border-slate-700/30">
        <CardTitle className="text-foreground dark:text-white flex items-center text-xl">
          <span className="text-2xl mr-3">🎯</span>
          {showAvailable ? "Available Challenges" : "Your Active Challenges"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loadingChallenges ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="p-4 bg-card/50 rounded-lg border border-border/20 animate-pulse"
              >
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
        ) : challenges.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No challenges available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge, idx) => (
              <div
                key={challenge.id || idx}
                className="p-4 bg-muted/30 dark:bg-slate-700/30 rounded-xl border border-border/30 dark:border-slate-600/30 hover:bg-muted/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-foreground dark:text-white font-semibold">
                      {challenge.name}
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                      {challenge.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 dark:text-green-400 font-bold">
                      +{challenge.rewardAmount || 100} BTR
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-slate-400">
                      {challenge.startDate} - {challenge.endDate}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400 mb-2">
                    <span>Type: {challenge.type}</span>
                  </div>
                </div>
                <div className="mb-4 space-y-3">
                  {/* Rewards */}
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-slate-400 mb-2">
                      Rewards:
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="text-xs text-muted-foreground dark:text-slate-400">
                          {challenge.rewards?.points} points
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-purple-500 mr-1">✨</span>
                        <span className="text-xs text-muted-foreground dark:text-slate-400">
                          {challenge.rewards?.experience} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Participants */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400 mb-2">
                      <span>
                        Participants: {challenge?.currentParticipants}/
                        {challenge?.maxParticipants}
                      </span>
                      <span>
                        {Math.round(
                          (challenge?.currentParticipants /
                            challenge?.maxParticipants) *
                            100
                        )}
                        % full
                      </span>
                    </div>
                    <div className="w-full bg-muted dark:bg-slate-600/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (challenge?.currentParticipants /
                              challenge?.maxParticipants) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    showAvailable ? handleJoin(challenge) : undefined
                  }
                  disabled={!showAvailable || challenge.joined}
                  className={`w-full ${
                    challenge.joined
                      ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white"
                  }`}
                  size="sm"
                >
                  {challenge.joined ? "Joined ✓" : "Join Challenge"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeSection;
