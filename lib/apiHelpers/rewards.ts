// import { apiGet } from "./apiMiddleware"; // Removed unused import

// Types for rewards stats
export interface RewardsStats {
  total: number;
  totalAmount: number;
  totalMiles: number;
  totalCarbonSaved: number;
  byType: {
    upload: number;
    badge: number;
    challenge: number;
  };
  byStatus: {
    pending: number;
    completed: number;
    failed: number;
  };
  byBlockchainStatus: {
    not_sent: number;
    confirmed: number;
    failed: number;
  };
  averageAmount: number;
  averageMiles: number;
  averageCarbonSaved: number;
  mostActiveDay: string;
  mostActiveDayCount: number;
}

// Mock data for rewards stats
const mockRewardsStats: RewardsStats = {
  total: 150,
  totalAmount: 1500.5,
  totalMiles: 15000.5,
  totalCarbonSaved: 2500.5,
  byType: {
    upload: 100,
    badge: 30,
    challenge: 20,
  },
  byStatus: {
    pending: 50,
    completed: 100,
    failed: 5,
  },
  byBlockchainStatus: {
    not_sent: 50,
    confirmed: 100,
    failed: 5,
  },
  averageAmount: 10,
  averageMiles: 100,
  averageCarbonSaved: 16.67,
  mostActiveDay: "2024-01-15",
  mostActiveDayCount: 8,
};

/**
 * Get rewards statistics
 * GET /admin/rewards/stats
 */
export const getRewardsStats = async (): Promise<RewardsStats> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(mockRewardsStats);
    }, 500)
  );

  // Commented out actual API call for future implementation
  /*
  return apiGet<RewardsStats>('/admin/rewards/stats', {
    requireAuth: true,
    isAdmin: true,
    showToast: false
  });
  */
};
