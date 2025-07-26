import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminData {
  id: string;
  username: string;
  email?: string;
  role: string;
  permissions?: string[];
  createdAt: string;
  lastLogin: string;
}

interface AdminLoginResponse {
  token: string;
  message: string;
  admin?: AdminData;
}

interface AdminState {
  isAuthenticated: boolean;
  admin: AdminData | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isAuthenticated: false,
  admin: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    adminLoginSuccess: (state, action: PayloadAction<AdminLoginResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.admin = action.payload.admin || null;
      state.accessToken = action.payload.token;
      state.error = null;
    },
    adminLoginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.admin = null;
      state.accessToken = null;
      state.error = action.payload;
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.accessToken = null;
      state.error = null;
      state.isLoading = false;
    },
    updateAdmin: (state, action: PayloadAction<Partial<AdminData>>) => {
      if (state.admin) {
        state.admin = {
          ...state.admin,
          ...action.payload,
          lastLogin: new Date().toISOString(),
        };
      }
    },
    updateAdminToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAdminError: (state) => {
      state.error = null;
    },
  },
});

export const {
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailure,
  adminLogout,
  updateAdmin,
  updateAdminToken,
  clearAdminError,
} = adminSlice.actions;

// Export types for external use
export type { AdminData, AdminLoginResponse };

export default adminSlice.reducer; 