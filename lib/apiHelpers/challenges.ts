import { apiGet, apiPost, apiPut, apiDelete } from "./apiMiddleware";
import { Challenge, mockChallenges } from "./challengesMock";
import { ChallengeListParams } from "../../app/admin/challenges/utils/filterOptions";

// API Response types
export interface ChallengesListResponse {
  challenges: Challenge[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChallengeResponse {
  challenge: Challenge;
  message?: string;
}

export interface CreateChallengeData {
  name: string;
  description: string;
  type: Challenge["type"];
  difficulty: Challenge["difficulty"];
  visibility: Challenge["visibility"];
  imageUrl: string;
  bannerUrl: string;
  objectives: Challenge["objectives"];
  rewards: Challenge["rewards"];
  leaderboardRewards: Challenge["leaderboardRewards"];
  startDate: string;
  endDate: string;
  maxParticipants: number;
  requirements: Challenge["requirements"];
  metadata: Challenge["metadata"];
  notes: string;
  status: Challenge["status"];
}

export interface UpdateChallengeData extends Partial<CreateChallengeData> {}

export interface PublishChallengeResponse {
  message: string;
  challenge: Challenge;
}

// API Functions

/**
 * Get list of challenges with filtering and pagination
 * Example: /admin/challenges?page=1&limit=20&type=mileage&status=draft&visibility=public
 */
export const getChallengesList = async (
  params: ChallengeListParams
): Promise<ChallengesListResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        challenges: mockChallenges,
        total: mockChallenges.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(mockChallenges.length / params.limit),
      });
    }, 500)
  );

  // Commented out actual API call for future implementation

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiGet<ChallengesListResponse>(
    `/admin/challenges?${queryParams.toString()}`,
    {
      requireAuth: true,
      isAdmin: true,
      showToast: false,
    }
  );
};

/**
 * Get a single challenge by ID
 * GET /admin/challenges/{id}
 */
export const getChallengeById = async (
  id: number
): Promise<ChallengeResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        challenge: mockChallenges[0],
      });
    }, 300)
  );

  // Commented out actual API call for future implementation
  /*
  return apiGet<ChallengeResponse>(`/admin/challenges/${id}`, {
    requireAuth: true,
    isAdmin: true,
    showToast: false
  });
  */
};

/**
 * Create a new challenge
 * POST /admin/challenges
 */
export const createChallenge = async (
  data: CreateChallengeData
): Promise<ChallengeResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        challenge: mockChallenges[0],
        message: "Challenge created successfully",
      });
    }, 800)
  );

  // Commented out actual API call for future implementation
  /*
  return apiPost<ChallengeResponse>('/admin/challenges', data, {
    requireAuth: true,
    isAdmin: true,
    showToast: true
  });
  */
};

/**
 * Update an existing challenge
 * PUT /admin/challenges/{id}
 */
export const updateChallenge = async (
  id: number,
  data: UpdateChallengeData
): Promise<ChallengeResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        challenge: mockChallenges[0],
        message: "Challenge updated successfully",
      });
    }, 600)
  );

  // Commented out actual API call for future implementation
  /*
  return apiPut<ChallengeResponse>(`/admin/challenges/${id}`, data, {
    requireAuth: true,
    isAdmin: true,
    showToast: true
  });
  */
};

/**
 * Delete a challenge
 * DELETE /admin/challenges/{id}
 */
export const deleteChallenge = async (
  id: number
): Promise<{ message: string }> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        message: "Challenge deleted successfully",
      });
    }, 400)
  );

  // Commented out actual API call for future implementation
  /*
  return apiDelete<{ message: string }>(`/admin/challenges/${id}`, {
    requireAuth: true,
    isAdmin: true,
    showToast: true
  });
  */
};

/**
 * Publish a challenge (change status to active)
 * PUT /admin/challenges/{id}/publish
 */
export const publishChallenge = async (
  id: number
): Promise<PublishChallengeResponse> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        message: "Challenge published successfully",
        challenge: mockChallenges[0],
      });
    }, 500)
  );

  // Commented out actual API call for future implementation
  /*
  return apiPut<PublishChallengeResponse>(`/admin/challenges/${id}/publish`, {}, {
    requireAuth: true,
    isAdmin: true,
    showToast: true
  });
  */
};

// Export types for use in components
export type { Challenge };
