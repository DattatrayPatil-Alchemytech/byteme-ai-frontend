import { apiGet, apiPost, apiPut, apiDelete } from "./apiMiddleware";
import { Challenge } from "./challengesMock";
import { ChallengeListParams } from "../../app/admin/challenges/utils/filterOptions";

// API Response types - matches actual backend response
export interface ChallengesListResponse {
  challenges: Challenge[];
  total: number;
  limit: number;
  page: number;
  totalPages?: number; // Calculated on frontend from total/limit
}

export interface ChallengeResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  difficulty: string;
  visibility: string;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  objectives?: {
    mileage?: number;
    uploadCount?: number;
    streakDays?: number;
    socialShares?: number;
    carbonSaved?: number;
    vehicleCount?: number;
  } | null;
  rewards?: {
    b3trTokens: number;
    points: number;
    experience: number;
  } | null;
  leaderboardRewards?: {
    first: { b3trTokens: number; points: number };
    second: { b3trTokens: number; points: number };
    third: { b3trTokens: number; points: number };
  } | null;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  completedParticipants: number;
  requirements?: {
    minLevel: number;
    minMileage: number;
  } | null;
  metadata?: {
    category: string;
    tags: string[];
    estimatedTime: string;
    featured: boolean;
  } | null;
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
}

export interface CreateChallengeData {
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  requirements?: {
    minLevel: number;
    minMileage: number;
  };
  status?: string;
}

export type UpdateChallengeData = Partial<CreateChallengeData>;

export interface PublishChallengeResponse {
  message: string;
  challenge: ChallengeResponse;
}

// API Functions

/**
 * Get list of challenges with filtering and pagination
 * Example: /admin/challenges?page=1&limit=20&type=mileage&status=draft&visibility=public
 */
export const getChallengesList = async (
  params: ChallengeListParams
): Promise<ChallengesListResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await apiGet<ChallengesListResponse>(
    `/admin/challenges?${queryParams.toString()}`,
    {
      requireAuth: true,
      isAdmin: true,
      showToast: false,
    }
  );

  // Calculate totalPages from total and limit
  const calculatedTotalPages = Math.ceil(response.total / response.limit);

  return {
    ...response,
    totalPages: calculatedTotalPages,
  };
};

/**
 * Get a single challenge by ID
 * GET /admin/challenges/{id}
 */
export const getChallengeById = async (
  id: string
): Promise<ChallengeResponse> => {
  return apiGet<ChallengeResponse>(`/admin/challenges/${id}`, {
    requireAuth: true,
    isAdmin: true,
    showToast: false,
  });
};

/**
 * Create a new challenge
 * POST /admin/challenges
 */
export const createChallenge = async (
  data: CreateChallengeData
): Promise<ChallengeResponse> => {
  return apiPost<ChallengeResponse>("/admin/challenges", data, {
    requireAuth: true,
    isAdmin: true,
    showToast: true,
  });
};

/**
 * Update an existing challenge
 * PUT /admin/challenges/{id}
 */
export const updateChallenge = async (
  id: string,
  data: UpdateChallengeData
): Promise<ChallengeResponse> => {
  return apiPut<ChallengeResponse>(`/admin/challenges/${id}`, data, {
    requireAuth: true,
    isAdmin: true,
    showToast: true,
  });
};

/**
 * Delete a challenge
 * DELETE /admin/challenges/{id}
 */
export const deleteChallenge = async (
  id: string
): Promise<{ message: string }> => {
  return apiDelete<{ message: string }>(`/admin/challenges/${id}`, {
    requireAuth: true,
    isAdmin: true,
    showToast: true,
  });
};

/**
 * Publish a challenge (change status to active)
 * PUT /admin/challenges/{id}/publish
 */
export const publishChallenge = async (
  id: string
): Promise<PublishChallengeResponse> => {
  return apiPut<PublishChallengeResponse>(
    `/admin/challenges/${id}/publish`,
    {},
    {
      requireAuth: true,
      isAdmin: true,
      showToast: true,
    }
  );
};

// Export types for use in components
export type { Challenge };
