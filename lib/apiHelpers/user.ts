// import { apiPost, apiGet } from "./apiMiddleware"; // Commented out for mock implementation
import { apiPost } from "./apiMiddleware";
import {
  mockVerifyLogin,
  mockRefreshToken,
  mockGetCurrentUser,
  mockUpdateUserProfile,
  mockLogoutUser,
  type UserData,
  type LoginResponse,
  type SignatureVerificationData,
} from "./utils";
import { store } from "@/redux/store";

// Verify login with signature data
export const verifyLogin = (
  signatureData: SignatureVerificationData
): Promise<LoginResponse> => {
  // Using mock implementation
  return mockVerifyLogin(signatureData);

  // TODO: Uncomment below for actual API implementation
  /*
  return apiPost<LoginResponse>("/auth/verify-login", signatureData, {
    requireAuth: false, // This is the login endpoint, no auth required
    showToast: false, // Handle toast manually for better UX
  });
  */
};

// Refresh token API - returns updated user details
export const refreshToken = (): Promise<LoginResponse> => {
  // Get current token from Redux store
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  // Using mock implementation
  return mockRefreshToken(currentToken);

  // TODO: Uncomment below for actual API implementation
  /*
  return apiPost<LoginResponse>("/auth/refresh-token", {}, {
    requireAuth: true, // Requires existing token
    showToast: false, // Handle toast manually
  });
  */
};

// Get current user profile
export const getCurrentUser = (): Promise<UserData> => {
  // Get current token from Redux store
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  // Using mock implementation
  return mockGetCurrentUser(currentToken);

  // TODO: Uncomment below for actual API implementation
  /*
  return apiGet<{ user: UserData }>("/auth/me", {
    requireAuth: true,
  }).then(response => response.user);
  */
};

// Update user profile
export const updateUserProfile = (
  userData: Partial<UserData>
): Promise<UserData> => {
  // Get current token from Redux store
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  // Using mock implementation
  return mockUpdateUserProfile(currentToken, userData);

  // TODO: Uncomment below for actual API implementation
  /*
  return apiPost<{ user: UserData }>("/auth/update-profile", userData, {
    requireAuth: true,
  }).then(response => response.user);
  */
};

// Logout user (invalidate token on server)
export const logoutUser = (): Promise<{
  success: boolean;
  message: string;
}> => {
  // Get current token from Redux store
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  // Using mock implementation
  return mockLogoutUser(currentToken);

  // TODO: Uncomment below for actual API implementation
  /*
  return apiPost<{ success: boolean; message: string }>("/auth/logout", {}, {
    requireAuth: true,
    showToast: false, // Handle logout toast in component
  });
  */
};

// Export types for use in components
export type { UserData, LoginResponse, SignatureVerificationData };
