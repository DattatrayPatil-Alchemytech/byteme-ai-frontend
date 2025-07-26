import { apiPut, apiPost, apiGet, apiDelete } from "./apiMiddleware";

// Dashboard data interface based on the provided JSON structure
export interface DashboardData {
  walletBalance: number;
  totalRewards: number;
  totalCarbonSaved: number;
  totalEvMiles: number;
  currentTier: string;
  totalPoints: number;
  vehicleCount: number;
  uploadCount: number;
  globalRank: number;
  weeklyStats: {
    milesThisWeek: number;
    carbonSavedThisWeek: number;
    rewardsEarnedThisWeek: number;
    uploadsThisWeek: number;
  };
  monthlyStats: {
    milesThisMonth: number;
    carbonSavedThisMonth: number;
    rewardsEarnedThisMonth: number;
    uploadsThisMonth: number;
  };
  recentActivity: unknown[];
}

// Function to get user vehicles for dashboard
export const getDashboardData = (): Promise<DashboardData> => {
  return apiGet<DashboardData>(`/user/dashboard`, {
    requireAuth: true,
    showToast: false,
  }).then((response) => {
    return response;
  });
};
