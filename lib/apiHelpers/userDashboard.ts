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

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  walletAddress: string;
  username: string;
  profileImageUrl: string;
  totalMileage: number;
  totalCarbonSaved: number;
  totalRewards: number;
  totalPoints: number;
  uploadCount: number;
  rankDisplay: string;
}

export interface LeaderboardResponse {
  period: string;
  periodStart: string;
  periodEnd: string;
  userRank: number;
  totalParticipants: number;
  entries: LeaderboardEntry[];
  page: number;
  limit: number;
  totalPages: number;
}

export interface VehicleHistoryItem {
  id: string;
  vehicle: string;
  submissionCount: number;
  milesDriven: number;
  carbonImpact: number;
  rewards: number;
  imageHash: string;
  date: string;
}

export interface VehicleHistoryResponse {
  history: VehicleHistoryItem[];
  total: number;
  page: number;
  limit: number;
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

export const getWeeklyLeaderboard = async (): Promise<LeaderboardResponse> => {
  return apiGet<LeaderboardResponse>(`/leaderboard?page=1&limit=5`, {
    requireAuth: true,
    showToast: false,
  });
};

// Get vehicle history with pagination
export const getVehicleHistory = (
  page: number = 1,
  limit: number = 20
): Promise<VehicleHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  return apiGet<VehicleHistoryResponse>(`/history?${params.toString()}`, {
    requireAuth: true,
    showToast: false,
  });
};
