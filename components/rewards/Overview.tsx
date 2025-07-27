"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewardsStats } from "@/lib/apiHelpers/rewards";

interface OverviewProps {
  rewardsStats: RewardsStats | null;
  loading?: boolean;
  formatDate: (dateString: string) => string;
}

export default function Overview({
  rewardsStats,
  loading = false,
  formatDate,
}: OverviewProps) {
  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
              </span>
              <div className="h-8 bg-muted rounded-full w-20 animate-pulse"></div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center p-3 sm:p-0 animate-pulse">
                <div className="h-4 bg-muted rounded w-16 mx-auto mb-2"></div>
                <div className="h-6 bg-muted rounded w-20 mx-auto mb-1"></div>
                <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rewardsStats) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Rewards Overview</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const completionRate = (
    (rewardsStats.byStatus.completed / rewardsStats.total) *
    100
  ).toFixed(1);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="block sm:hidden">Rewards Overview</span>
              <span className="hidden sm:block">
                Rewards Distribution Overview
              </span>
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300">
              Active
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 sm:p-0 bg-muted/30 sm:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Rewards
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              <span className="block sm:hidden">
                ${Math.floor(rewardsStats.totalAmount)}
              </span>
              <span className="hidden sm:block">
                ${rewardsStats.totalAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="block sm:hidden">
                {rewardsStats.total} rewards
              </span>
              <span className="hidden sm:block">
                Total of {rewardsStats.total} rewards
              </span>
            </p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-blue-50 dark:bg-blue-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <p className="text-sm sm:text-lg font-bold text-blue-600">
              {rewardsStats.byStatus.completed}
            </p>
            <p className="text-xs text-blue-500">
              {completionRate}% success rate
            </p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-yellow-50 dark:bg-yellow-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Pending
            </p>
            <p className="text-sm sm:text-lg font-bold text-yellow-600">
              {rewardsStats.byStatus.pending}
            </p>
            <p className="text-xs text-yellow-500">Processing</p>
          </div>
          <div className="text-center p-3 sm:p-0 bg-emerald-50 dark:bg-emerald-900/20 sm:bg-transparent sm:dark:bg-transparent rounded-lg sm:rounded-none">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Most Active
            </p>
            <p className="text-sm sm:text-lg font-bold text-emerald-600">
              <span className="block sm:hidden">
                {rewardsStats.mostActiveDayCount}
              </span>
              <span className="hidden sm:block">
                {rewardsStats.mostActiveDayCount} rewards
              </span>
            </p>
            <p className="text-xs text-emerald-500">
              {formatDate(rewardsStats.mostActiveDay)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
