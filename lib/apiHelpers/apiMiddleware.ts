"use client";

import toast from "react-hot-toast";
import { store } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { adminLogout } from "@/redux/adminSlice";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://byteme-ai.alchemytech.in';

// HTTP Methods type
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Request Options
interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
  showToast?: boolean;
  isAdmin?: boolean;
}

// API Response wrapper
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error class
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Main API middleware function
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    requireAuth = true,
    showToast = true,
    isAdmin = false,
  } = options;

  try {
    // Get access tokens from Redux store
    const state = store.getState();
    const userAccessToken = state.user.accessToken;
    const adminAccessToken = state.admin.accessToken;
    
    // Use admin token if isAdmin flag is set, otherwise use user token
    const accessToken = isAdmin ? adminAccessToken : userAccessToken;

    // Check if auth is required but token is missing
    if (requireAuth && !accessToken) {
      const errorMessage = "Authentication required. Please login again.";
      if (showToast) {
        toast.error(errorMessage);
      }
      // Logout based on the type of authentication being used
      if (isAdmin) {
        store.dispatch(adminLogout());
      } else {
        store.dispatch(logout());
      }
      throw new ApiError(401, errorMessage);
    }

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    // Only set Content-Type to application/json if body is not FormData
    if (!(body instanceof FormData)) {
      requestHeaders["Content-Type"] = "application/json";
    }

    // Add authorization header if token exists and auth is required
    if (requireAuth && accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body for methods that support it
    if (body && !["GET", "HEAD"].includes(method)) {
      // Don't JSON.stringify if body is FormData
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    // Make the API request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // Handle different response statuses
    if (!response.ok) {
      let errorMessage = "An error occurred";
      let errorData = null;

      try {
        const errorResponse = await response.json();
        errorMessage =
          errorResponse.message || errorResponse.error || errorMessage;
        errorData = errorResponse;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      // Handle 401 Unauthorized - logout user or admin
      if (response.status === 401) {
        if (showToast) {
          toast.error("Session expired. Please login again.");
        }
        // Logout based on the type of authentication being used
        if (isAdmin) {
          store.dispatch(adminLogout());
        } else {
          store.dispatch(logout());
        }
        throw new ApiError(401, "Unauthorized", errorData);
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        if (showToast) {
          toast.error(
            "Access denied. You don't have permission for this action."
          );
        }
        throw new ApiError(403, errorMessage, errorData);
      }

      // Handle 404 Not Found
      if (response.status === 404) {
        if (showToast) {
          toast.error("Resource not found.");
        }
        throw new ApiError(404, errorMessage, errorData);
      }

      // Handle 422 Validation Error
      if (response.status === 422) {
        if (showToast) {
          toast.error(errorMessage || "Validation error occurred.");
        }
        throw new ApiError(422, errorMessage, errorData);
      }

      // Handle 500 Server Error
      if (response.status >= 500) {
        if (showToast) {
          toast.error("Server error occurred. Please try again later.");
        }
        throw new ApiError(response.status, errorMessage, errorData);
      }

      // Handle other client errors (4xx)
      if (response.status >= 400) {
        if (showToast) {
          toast.error(errorMessage);
        }
        throw new ApiError(response.status, errorMessage, errorData);
      }
    }

    // Parse response data
    let responseData: unknown;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log('Response data:', responseData);
    console.log('Response data type:', typeof responseData);

    // Return the data
    return responseData as T;
  } catch (error) {
    // Handle network errors or other fetch errors
    if (error instanceof ApiError) {
      throw error;
    }

    const networkError =
      "Network error occurred. Please check your connection.";
    if (showToast) {
      toast.error(networkError);
    }
    throw new ApiError(0, networkError);
  }
};

// Convenience methods for different HTTP verbs
export const apiGet = <T = unknown>(
  endpoint: string,
  options: Omit<ApiOptions, "method"> = {}
): Promise<T> => apiRequest<T>(endpoint, { ...options, method: "GET" });

export const apiPost = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<T> => apiRequest<T>(endpoint, { ...options, method: "POST", body });

export const apiPut = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<T> => apiRequest<T>(endpoint, { ...options, method: "PUT", body });

export const apiPatch = <T = unknown>(
  endpoint: string,
  body?: unknown,
  options: Omit<ApiOptions, "method" | "body"> = {}
): Promise<T> => apiRequest<T>(endpoint, { ...options, method: "PATCH", body });

export const apiDelete = <T = unknown>(
  endpoint: string,
  options: Omit<ApiOptions, "method"> = {}
): Promise<T> => apiRequest<T>(endpoint, { ...options, method: "DELETE" });

// Export ApiError for use in components
export { ApiError };

// Export types
export type { ApiOptions, ApiResponse };
