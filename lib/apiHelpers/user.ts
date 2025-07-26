import { apiPost, apiGet, apiPut } from "./apiMiddleware";
import { API_ENDPOINTS } from "@/lib/api/config";
import type { UserData, LoginResponse } from "@/redux/userSlice";

interface SignatureVerificationPayload {
  certificate: {
    purpose: string;
    payload: {
      type: string;
      content: string;
    };
    signature?: string; // Optional to match VeChain CertificateData
    signer?: string; // Optional to match VeChain CertificateData
    domain: string;
    timestamp: number;
  };
}

interface UserProfileUpdatePayload {
  username: string;
  email: string;
  profileImageUrl?: string;
}

// Verify signature with wallet data
export const verifySignature = (
  signaturePayload: SignatureVerificationPayload
): Promise<LoginResponse> => {
  return apiPost<LoginResponse>(
    API_ENDPOINTS.AUTH.VERIFY_SIGNATURE,
    signaturePayload,
    {
      requireAuth: false,
      showToast: false,
    }
  );
};

// Disconnect user session (invalidate token on server)
export const disconnectUser = (): Promise<{
  success: boolean;
  message: string;
}> => {
  return apiPost<{ success: boolean; message: string }>(
    API_ENDPOINTS.AUTH.DISCONNECT,
    {},
    {
      requireAuth: true,
      showToast: false,
    }
  );
};

// Get current user profile
export const getUserProfile = (): Promise<UserData> => {
  return apiGet<UserData>(API_ENDPOINTS.USER.PROFILE, {
    requireAuth: true,
  });
};

// Update user profile
export const updateUserProfile = (
  userData: UserProfileUpdatePayload
): Promise<UserData> => {
  return apiPut<UserData>(API_ENDPOINTS.USER.PROFILE, userData, {
    requireAuth: true,
  });
};

// Export types for use in components
export type {
  UserData,
  LoginResponse,
  SignatureVerificationPayload,
  UserProfileUpdatePayload,
};
