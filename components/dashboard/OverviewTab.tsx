import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardData,
  type DashboardData,
} from "@/lib/apiHelpers/userDashboard";

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
      })
      .finally(() => setLoading(false));
  }, []);

  console.log("dashboard ------------", dashboard);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded w-24 mb-2"></div>
              <div className="h-6 bg-muted rounded w-16 mb-1"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  B3TR Tokens
                </p>
                <p className="text-2xl font-bold text-gradient-ev-green">
                  {dashboard.walletBalance?.toLocaleString?.() ??
                    dashboard.walletBalance}
                </p>
                <p className="text-xs text-primary">Total earned</p>
              </div>
              <div className="p-1 bg-primary/20 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sustainable Miles
                </p>
                <p className="text-2xl font-bold text-gradient-ev-light">
                  {dashboard.totalEvMiles?.toLocaleString?.() ??
                    dashboard.totalEvMiles}
                </p>
                <p className="text-xs text-success">Total driven</p>
              </div>
              <div className="p-1 bg-primary/20 rounded-lg">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift gradient-ev-nature/10 border-secondary/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  CO₂ Saved
                </p>
                <p className="text-2xl font-bold text-gradient-ev-light">
                  {dashboard.totalCarbonSaved}
                </p>
                <p className="text-xs text-success">tons</p>
              </div>
              <div className="p-1 bg-primary/20 rounded-lg">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift gradient-ev-fresh/10 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Rank
                </p>
                <p className="text-2xl font-bold text-gradient-ev-green">
                  #{dashboard.globalRank}
                </p>
                <p className="text-xs text-primary">This week</p>
              </div>
              <div className="p-1 bg-primary/20 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Info & Mileage History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Miles</p>
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
                  <p className="text-sm text-muted-foreground">
                    Weekly Rewards
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    Weekly Uploads
                  </p>
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
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <p className="text-2xl font-bold text-gradient-ev-light capitalize">
                    {dashboard.currentTier}
                  </p>
                  <p className="text-xs text-success">
                    {dashboard.totalPoints} points
                  </p>
                </div>
                <div className="p-1 bg-primary/20 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Monthly Miles
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {dashboard.monthlyStats?.milesThisMonth} miles
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">
                    +{dashboard.monthlyStats?.rewardsEarnedThisMonth} B3TR
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Monthly Carbon Saved
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {dashboard.monthlyStats?.carbonSavedThisMonth} tons CO₂
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-success font-semibold">🌱 Eco Impact</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Monthly Uploads
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {dashboard.monthlyStats?.uploadsThisMonth} submissions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">📈 Active</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Total Vehicles
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {dashboard.vehicleCount} registered
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">🚗 Fleet</p>
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
