import { apiGet, apiPut } from "./apiMiddleware";

// User data type
export interface AdminUser {
  id: string;
  walletAddress: string;
  email: string;
  totalMileage: number;
  totalCarbonSaved: number;
  b3trBalance: number;
  currentTier: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

// Users list response type
export interface UsersListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

// Get users list with pagination and search
export const getUsersList = (
  page: number = 1, 
  limit: number = 10, 
  search?: string
): Promise<UsersListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  
  return apiGet<UsersListResponse>(`/admin/users?${params.toString()}`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Get single user details
export const getUserDetails = (id: string): Promise<AdminUser> => {
  return apiGet<AdminUser>(`/admin/users/${id}`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Toggle user active/disabled status
export const toggleUserStatus = (id: string): Promise<AdminUser> => {
  return apiPut<AdminUser>(`/admin/users/${id}/toggle-status`, undefined, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Get user vehicles
export const getUserVehicles = (id: string): Promise<unknown> => {
  return apiGet<unknown>(`/admin/users/${id}/vehicles`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

export const getUserUploads = (id: string): Promise<unknown> => {
  return apiGet<unknown>(`/admin/users/${id}/uploads`, {
    requireAuth: true,
    isAdmin: true, // Use admin token
  });
};

// Export types for use in components 