import { apiGet } from "./apiMiddleware";

// User badge data type based on real API response
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  status: string;
  imageUrl?: string;
  iconUrl?: string;
  conditions: {
    mileage?: number;
    uploadStreak?: number;
    carbonSaved?: number;
    timeFrame?: string;
    [key: string]: unknown;
  };
  rewards: {
    b3trTokens: number;
    points: number;
    experience: number;
    [key: string]: unknown;
  };
  pointsValue: number;
  earnedCount: number;
  metadata: string | object;
  isPublished: boolean;
  canBeEdited: boolean;
  formattedRewards: string;
  difficultyDisplay: string;
  rarityColor: string;
  createdAt: string;
  updatedAt: string;
  isEarned?: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// User badges response type
export interface UserBadgesResponse {
  userBadges: UserBadge[];
  total: number;
  page: number;
  limit: number;
}

// Get user badges
export const getUserBadges = (): Promise<UserBadgesResponse> => {
  return apiGet<UserBadgesResponse>('/user/badges', {
    requireAuth: true,
  });
}; 