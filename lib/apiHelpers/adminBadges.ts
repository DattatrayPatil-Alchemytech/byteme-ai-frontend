import { apiGet, apiPost, apiPut, apiDelete } from "./apiMiddleware";

// Badge data type based on the provided JSON structure
export interface AdminBadge {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  status: string;
  imageUrl: string;
  iconUrl: string;
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
  metadata: string | object; // Can be JSON string or object
  isPublished: boolean;
  canBeEdited: boolean;
  formattedRewards: string;
  difficultyDisplay: string;
  rarityColor: string;
  createdAt: string;
  updatedAt: string;
}

// Badges list response type
export interface BadgesListResponse {
  badges: AdminBadge[];
  total: number;
  page: number;
  limit: number;
}

// Create badge request type
export interface CreateBadgeRequest {
  name: string;
  description: string;
  type: string;
  rarity: string;
  imageUrl: string;
  iconUrl: string;
  conditions: Record<string, unknown>;
  rewards: Record<string, unknown>;
  pointsValue: number;
  metadata: Record<string, unknown>;
  notes?: string;
}

// Update badge request type
export interface UpdateBadgeRequest extends Partial<CreateBadgeRequest> {
  isActive?: boolean;
}

// Get badges list with pagination and search
export const getBadgesList = (
  page: number = 1, 
  limit: number = 10, 
  search?: string
): Promise<BadgesListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  
  return apiGet<BadgesListResponse>(`/admin/badges?${params.toString()}`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Get single badge details
export const getBadgeDetails = (id: string): Promise<AdminBadge> => {
  return apiGet<AdminBadge>(`/admin/badges/${id}`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Create new badge
export const createBadge = (badgeData: CreateBadgeRequest): Promise<AdminBadge> => {
  return apiPost<AdminBadge>(`/admin/badges`, badgeData, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Update badge
export const updateBadge = (id: string, badgeData: UpdateBadgeRequest): Promise<AdminBadge> => {
  return apiPut<AdminBadge>(`/admin/badges/${id}`, badgeData, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Delete badge
export const deleteBadge = (id: string): Promise<void> => {
  return apiDelete<void>(`/admin/badges/${id}`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Publish badge
export const publishBadge = (id: string): Promise<AdminBadge> => {
  return apiPut<AdminBadge>(`/admin/badges/${id}/publish`, undefined, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Export types for use in components 