import { apiGet, apiPost } from "./apiMiddleware";

// Challenge data structure
export interface AvailableChallenge {
  id: string;
  name: string;
  description: string;
  type: "mileage" | "carbon-saved" | "upload" | "streak" | "vehicle-count";
  status: "draft" | "active" | "cancelled" | "completed";
  difficulty: "easy" | "medium" | "hard";
  visibility: "private" | "public" | "invite-only";
  imageUrl: string;
  bannerUrl: string;
  objectives: Record<string, unknown>;
  rewards: Record<string, unknown>;
  leaderboardRewards: Record<string, unknown>;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  completedParticipants: number;
  requirements: Record<string, unknown>;
  metadata: Record<string, unknown>;
  isActive: boolean;
  isUpcoming: boolean;
  isCompleted: boolean;
  isPublished: boolean;
  canBeEdited: boolean;
  isFull: boolean;
  daysRemaining: number;
  progressPercentage: number;
  completionRate: number;
  formattedDuration: string;
  difficultyColor: string;
  createdAt: string;
  updatedAt: string;
  userJoined?: boolean; // Added to track if user has joined
}

// API Response types - matches actual backend response
export interface AvailableChallengesResponse {
  challenges: AvailableChallenge[];
  total: number;
  limit: number;
  page: number;
}

export interface JoinChallengeResponse {
  message: string;
  success: boolean;
  challengeId: string;
}

// Mock data removed - now using real API data

/**
 * Get available challenges for users
 * GET /challenges/available
 */
export const getAvailableChallenges =
  async (): Promise<AvailableChallengesResponse> => {
    return apiGet<AvailableChallengesResponse>("/challenges/available", {
      requireAuth: true,
      showToast: false,
    });
  };

/**
 * Join a challenge
 * POST /challenges/{id}/join
 */
export const joinChallenge = async (
  challengeId: string
): Promise<JoinChallengeResponse> => {
  return apiPost<JoinChallengeResponse>(
    `/challenges/${challengeId}/join`,
    {},
    {
      requireAuth: true,
      showToast: true,
    }
  );
};
