import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData, type DashboardData } from "@/lib/apiHelpers/userDashboard";

const defaultDashboard: DashboardData = {
  walletBalance: 0,
  totalRewards: 0,
  totalCarbonSaved: 0,
  totalEvMiles: 0,
  currentTier: "",
  totalPoints: 0,
  vehicleCount: 0,
  uploadCount: 0,
  globalRank: 0,
  weeklyStats: {
    milesThisWeek: 0,
    carbonSavedThisWeek: 0,
    rewardsEarnedThisWeek: 0,
    uploadsThisWeek: 0,
  },
  monthlyStats: {
    milesThisMonth: 0,
    carbonSavedThisMonth: 0,
    rewardsEarnedThisMonth: 0,
    uploadsThisMonth: 0,
  },
  recentActivity: [],
};

const OverviewTab = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDashboardData()
      .then((data) => {
        setDashboard(data);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data", err);
        setDashboard(defaultDashboard);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        {/* Loading skeleton for 3-3 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Card key={idx} className="animate-pulse bg-card dark:bg-card-dark border border-border dark:border-border-dark">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-muted dark:bg-muted-dark rounded w-24 mb-2"></div>
                    <div className="h-6 bg-muted dark:bg-muted-dark rounded w-16 mb-1"></div>
                    <div className="h-3 bg-muted dark:bg-muted-dark rounded w-12"></div>
                  </div>
                  <div className="w-10 h-10 bg-muted dark:bg-muted-dark rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  // Prepare the 6 cards as an array for easy rendering
  const statCards = [
    {
      label: "B3TR Tokens",
      value: dashboard.walletBalance?.toLocaleString?.() ?? dashboard.walletBalance,
      sub: "Total earned",
      icon: "⚡",
      cardClass: "border-primary/20 dark:border-primary/40",
      valueClass: "text-gradient-ev-green",
      subClass: "text-primary",
    },
    {
      label: "CO₂ Saved",
      value: dashboard.totalCarbonSaved,
      sub: "tons",
      icon: "🌱",
      cardClass: "border-secondary/20 dark:border-secondary/40",
      valueClass: "text-gradient-ev-light",
      subClass: "text-success",
    },
    {
      label: "Global Rank",
      value: `#${dashboard.globalRank}`,
      sub: "Global",
      icon: "🏆",
      cardClass: "border-cyan-500/20 dark:border-cyan-500/40",
      valueClass: "text-gradient-ev-green",
      subClass: "text-primary",
    },
    {
      label: "Uploads",
      value: dashboard.uploadCount?.toLocaleString?.() ?? dashboard.uploadCount,
      sub: "Total uploads",
      icon: "⬆️",
      cardClass: "border-pink-500/20 dark:border-pink-500/40",
      valueClass: "text-pink-500",
      subClass: "text-pink-600 dark:text-pink-400",
    },
    {
      label: "Sustainable Miles",
      value: dashboard.totalEvMiles?.toLocaleString?.() ?? dashboard.totalEvMiles,
      sub: "Total driven",
      icon: "🚗",
      cardClass: "border-success/20 dark:border-success/40",
      valueClass: "text-gradient-ev-light",
      subClass: "text-success",
    },
    {
      label: "Total Rewards",
      value: dashboard.totalRewards?.toLocaleString?.() ?? dashboard.totalRewards,
      sub: "All time",
      icon: "🎁",
      cardClass: "border-yellow-500/20 dark:border-yellow-500/40",
      valueClass: "text-yellow-500",
      subClass: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <>
      {/* Stats Grid: 3-3 layout for large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.label} className={`hover-lift bg-card dark:bg-card-dark border ${card.cardClass} backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground-dark">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
                  <p className={`text-xs ${card.subClass}`}>{card.sub}</p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly and Monthly Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover-lift bg-card dark:bg-card-dark border border-primary/20 dark:border-primary/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground dark:text-foreground-dark">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Weekly Miles</p>
                  <p className="text-2xl font-bold text-gradient-ev-green">
                    {dashboard.weeklyStats?.milesThisWeek}
                  </p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Weekly Rewards</p>
                  <p className="text-2xl font-bold text-gradient-ev-green">
                    {dashboard.weeklyStats?.rewardsEarnedThisWeek}
                  </p>
                  <p className="text-xs text-primary">B3TR earned</p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Weekly Uploads</p>
                  <p className="text-2xl font-bold text-gradient-ev-light">
                    {dashboard.weeklyStats?.uploadsThisWeek}
                  </p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">📝</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Current Tier</p>
                  <p className="text-2xl font-bold text-gradient-ev-light capitalize">
                    {dashboard.currentTier}
                  </p>
                  <p className="text-xs text-success">{dashboard.totalPoints} points</p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card dark:bg-card-dark border border-success/20 dark:border-success/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground dark:text-foreground-dark">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Monthly Miles */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Monthly Miles</p>
                  <p className="text-2xl font-bold text-gradient-ev-green">
                    {dashboard.monthlyStats?.milesThisMonth}
                  </p>
                  <p className="text-xs text-primary">+{dashboard.monthlyStats?.rewardsEarnedThisMonth} B3TR</p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
              </div>

              {/* Monthly Carbon Saved */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Monthly Carbon Saved</p>
                  <p className="text-2xl font-bold text-gradient-ev-light">
                    {dashboard.monthlyStats?.carbonSavedThisMonth} tons CO₂
                  </p>
                  <p className="text-xs text-success">Eco Impact</p>
                </div>
                <div className="p-1 bg-success/20 rounded-lg">
                  <span className="text-2xl">🌱</span>
                </div>
              </div>

              {/* Monthly Uploads */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Monthly Uploads</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {dashboard.monthlyStats?.uploadsThisMonth}
                  </p>
                  <p className="text-xs text-blue-600">submissions</p>
                </div>
                <div className="p-1 bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
              </div>

              {/* Total Vehicles */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Total Vehicles</p>
                  <p className="text-2xl font-bold text-pink-500">
                    {dashboard.vehicleCount}
                  </p>
                  <p className="text-xs text-pink-600">registered</p>
                </div>
                <div className="p-1 bg-pink-500/20 rounded-lg">
                  <span className="text-2xl">🚗</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewTab;
