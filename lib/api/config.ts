/**
 * API Configuration
 */

/**
 * Get environment from NODE_ENV
 */
export function getEnv(): string {
  return process.env.NODE_ENV || "development";
}

/**
 * Get API base URL based on environment
 */
export function getBaseURL(): string {
  const env = getEnv();

  if (env === "production") {
    return process.env.NEXT_PUBLIC_API_URL || "https://api.byteme-ai.com";
  }

  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    VERIFY_SIGNATURE: "/auth/verify-signature",
    DISCONNECT: "/auth/disconnect",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
    REFRESH: "/auth/refresh",
  },

  // User endpoints
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },

  // VeChain endpoints
  VECHAIN: {
    VERIFY_LOGIN: "/api/verify-login",
    GET_NONCE: "/api/get-nonce",
  },
} as const;
