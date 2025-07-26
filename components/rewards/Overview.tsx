"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewProps {
  currentRound: {
    roundNumber: number;
    status: "active" | "completed" | "distributing";
    startDate: string;
    endDate: string;
    totalPoolAmount: number;
    remainingPoolAmount: number;
    totalParticipants: number;
    participationRate: number;
  };
  formatDate: (dateString: string) => string;
}

export default function Overview({ currentRound, formatDate }: OverviewProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="block sm:hidden">
                Round {currentRound.roundNumber}
              </span>
              <span className="hidden sm:block">
                Round {currentRound.roundNumber} Overview
              </span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentRound.status === "active"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300"
                  : currentRound.status === "completed"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300"
              }`}
            >
              {currentRound.status.charAt(0).toUpperCase() +
                currentRound.status.slice(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 sm:p-0 bg-muted/30 sm:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Period
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              <span className="block sm:hidden">30 days</span>
              <span className="hidden sm:block">
                {formatDate(currentRound.startDate)} -{" "}
                {formatDate(currentRound.endDate)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="block sm:hidden">Duration</span>
              <span className="hidden sm:block">Duration: 30 days</span>
            </p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-purple-50 dark:bg-purple-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Pool
            </p>
            <p className="text-sm sm:text-lg font-bold text-purple-600">
              <span className="block sm:hidden">
                {Math.floor(currentRound.totalPoolAmount / 1000)}k B3TR
              </span>
              <span className="hidden sm:block">
                {currentRound.totalPoolAmount.toLocaleString()} B3TR
              </span>
            </p>
            <p className="text-xs text-purple-500">
              <span className="block sm:hidden">Available</span>
              <span className="hidden sm:block">
                Available for distribution
              </span>
            </p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-emerald-50 dark:bg-emerald-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <p className="text-sm sm:text-lg font-bold text-emerald-600">
              <span className="block sm:hidden">
                {Math.floor(currentRound.remainingPoolAmount / 1000)}k B3TR
              </span>
              <span className="hidden sm:block">
                {currentRound.remainingPoolAmount.toLocaleString()} B3TR
              </span>
            </p>
            <p className="text-xs text-emerald-500">
              {(
                (currentRound.remainingPoolAmount /
                  currentRound.totalPoolAmount) *
                100
              ).toFixed(1)}
              % left
            </p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-blue-50 dark:bg-blue-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Users
            </p>
            <p className="text-sm sm:text-lg font-bold text-blue-600">
              {currentRound.totalParticipants}
            </p>
            <p className="text-xs text-blue-500">
              {currentRound.participationRate}% active
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
