import { apiPost } from "./apiMiddleware";

// Admin login response type
export interface AdminLoginResponse {
  token: string;
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