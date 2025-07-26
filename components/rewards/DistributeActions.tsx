"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DistributeActionsProps {
  currentRound: {
    status: "active" | "completed" | "distributing";
    remainingPoolAmount: number;
    totalParticipants: number;
  };
  isDistributing: boolean;
  handleDistributeRewards: () => void;
  handleStartNewRound: () => void;
}

export default function DistributeActions({
  currentRound,
  isDistributing,
  handleDistributeRewards,
  handleStartNewRound,
}: DistributeActionsProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Distribution Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentRound.status === "active" &&
            currentRound.remainingPoolAmount > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Ready to Distribute
                    </h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">
                      Distribute{" "}
                      {currentRound.remainingPoolAmount.toLocaleString()} B3TR
                      to {currentRound.totalParticipants} participants
                    </p>
                  </div>
                  <Button
                    onClick={handleDistributeRewards}
                    disabled={isDistributing}
                    className="gradient-ev-green hover:from-emerald-600 hover:to-green-700 whitespace-nowrap"
                  >
                    {isDistributing ? "Distributing..." : "Distribute Rewards"}
                  </Button>
                </div>
              </div>
            )}

          {currentRound.status === "completed" &&
            currentRound.remainingPoolAmount === 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Round Completed
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      All rewards have been distributed. Ready to start a new
                      round?
                    </p>
                  </div>
                  <Button
                    onClick={handleStartNewRound}
                    className="gradient-ev-green hover:from-emerald-600 hover:to-green-700 whitespace-nowrap"
                  >
                    Start New Round
                  </Button>
                </div>
              </div>
            )}

          {currentRound.status === "distributing" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Distribution in Progress
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Please wait while rewards are being distributed...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
