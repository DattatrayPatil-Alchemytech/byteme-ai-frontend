import { apiGet } from "./apiMiddleware";

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
  userId: string;
  type: string;
  category: string;
  title: string;
  description: string;
  data: {
    activity: string;
    timestamp: string;
    userId: string;
    value: number;
    previousValue: number;
  };
  value: string;
  previousValue: string;
  isVisible: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  isRecent: boolean;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
  formattedValue: string;
  valueChange: number;
  formattedValueChange: string;
  isPositiveChange: boolean;
  categoryIcon: string;
  typeIcon: string;
  formattedCreatedAt: string;
  canBeDeleted: boolean;
  actionButtonText: string;
}

export interface VehicleHistoryResponse {
  history: VehicleHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

// Notification interfaces
export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type?: string;
  category?: string;
  data?: Record<string, unknown>;
}

export interface NotificationResponse {
  notifications: Notification[];
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

// Get notifications with pagination
export const getNotifications = (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<NotificationResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (unreadOnly) {
    params.append("unread", "true");
  }

  return apiGet<NotificationResponse>(`/notifications?${params.toString()}`, {
    requireAuth: true,
    showToast: false,
  });
};

// Get vehicle history with pagination
export const getVehicleHistory = (
  page: number = 1,
  limit: number = 20,
  search?: string,
  type?: string
): Promise<VehicleHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  if (type && type.trim()) {
    params.append("type", type.trim());
  }

  return apiGet<VehicleHistoryResponse>(`/history?${params.toString()}`, {
    requireAuth: true,
    showToast: false,
  });
};
