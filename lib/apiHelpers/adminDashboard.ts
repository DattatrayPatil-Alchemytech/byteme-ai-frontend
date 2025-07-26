import { apiGet } from "./apiMiddleware";

// Dashboard stats response type
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalVehicles: number;
  totalEvMiles: number;
  totalCarbonSaved: number;
  totalTokensDistributed: number;
  weeklyRewardsDistributed: number;
  totalUploads: number;
  pendingUploads: number;
  totalOrders: number;
  pendingOrders: number;
}

// Analytics data types
export interface UserGrowthData {
  date: string;
  count: string;
}

export interface VehicleTypeData {
  type: string;
  count: string;
}

export interface UploadStatusData {
  status: string;
  count: string;
}

export interface SystemAnalytics {
  userGrowth: UserGrowthData[];
  vehicleTypes: VehicleTypeData[];
  uploadStatus: UploadStatusData[];
}

// Get dashboard stats
export const getDashboardStats = (): Promise<DashboardStats> => {
  return apiGet<DashboardStats>("/admin/dashboard/stats", {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Get system analytics
export const getSystemAnalytics = (): Promise<SystemAnalytics> => {
  return apiGet<SystemAnalytics>("/admin/analytics/system", {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Export types for use in components 