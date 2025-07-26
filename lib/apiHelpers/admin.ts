import { apiPost } from "./apiMiddleware";

// Admin user data type
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  isActive: boolean;
  isVerified: boolean;
  totalMileage: number;
  totalCarbonSaved: number;
  totalPoints: number;
  currentTier: string;
  b3trBalance: number;
  profileImageUrl: string | null;
}

// Admin login response type
export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: AdminUser;
  message: string;
}

// Admin login credentials type
export interface AdminLoginCredentials {
  username: string;
  password: string;
}

// Admin login function
export const adminLogin = (
  credentials: AdminLoginCredentials
): Promise<AdminLoginResponse> => {
  return apiPost<AdminLoginResponse>("/admin/login", credentials, {
    requireAuth: false, // This is the login endpoint, no auth required
    showToast: false, // Handle toast manually for better UX
  });
};

// Export types for use in components 