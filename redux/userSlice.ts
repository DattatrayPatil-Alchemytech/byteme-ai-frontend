import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id: string;
  walletAddress: string;
  email: string;
  username: string;
  profileImageUrl?: string;
  currentTier: string;
  totalMileage: number;
  totalCarbonSaved: number;
  b3trBalance: number;
  totalPoints: number;
  createdAt: string;
  lastLogin: string;
  // Legacy fields for backward compatibility
  isActive?: boolean;
  isVerified?: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  message: string;
  user: UserData;
}

interface UserState {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  refreshExpiresIn: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  refreshExpiresIn: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresIn = action.payload.expiresIn;
      state.refreshExpiresIn = action.payload.refreshExpiresIn;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.refreshExpiresIn = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.refreshExpiresIn = null;
      state.error = null;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          // Update lastLogin timestamp when user data is updated
          lastLogin: new Date().toISOString(),
        };
      }
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    updateRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresIn = action.payload.expiresIn;
      state.refreshExpiresIn = action.payload.refreshExpiresIn;
    },
    updateProfile: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateToken,
  updateRefreshToken,
  updateTokens,
  updateProfile,
  clearError,
} = userSlice.actions;

// Export types for external use
export type { UserData, LoginResponse };

export default userSlice.reducer;
