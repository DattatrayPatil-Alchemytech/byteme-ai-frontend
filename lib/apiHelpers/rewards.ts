import { apiGet, apiPost } from "./apiMiddleware";

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

interface RewardBlockchainData {
  txHash: {
    txid: string;
    totalDistributed: string;
    batchCount: number;
    totalUsers: number;
  };
  sentAt: string;
}

export interface Reward {
  status: string;
  blockchainStatus: string;
  amount: string;
  milesDriven: string;
  carbonSaved: string;
  cycleId: string | null;
  blockchainData: RewardBlockchainData;
  processedAt: string;
  confirmedAt: string;
  typeIcon: string;
  statusColor: string;
  blockchainStatusColor: string;
}

interface RewardsResponse {
  rewards: Reward[];
}

/**
 * Get rewards statistics
 * GET /admin/rewards/stats
 */
export const getRewardsStats = async (): Promise<RewardsStats> => {
  return apiGet<RewardsStats>("/admin/rewards/stats", {
    requireAuth: true,
    isAdmin: true,
  });
};

/**
 * GET /admin/rewards
 */
export const getRewards = async (): Promise<RewardsResponse> => {
  return apiGet<RewardsResponse>("/admin/rewards", {
    isAdmin: true,
    requireAuth: true,
  });
};

/**
 * POST /admin/rewards/process/pending-rewards
 */
export const processPendingRewards = async () => {
  return apiPost(
    "/admin/rewards/process/pending-rewards",
    {},
    {
      isAdmin: true,
      requireAuth: true,
    }
  );
};

/**
 * POST /admin/rewards/verify/blockchain-transactions
 */
export const verifyBlockchainTransactions = async () => {
  return apiPost(
    "/admin/rewards/verify/blockchain-transactions",
    {},
    {
      isAdmin: true,
      requireAuth: true,
    }
  );
};
