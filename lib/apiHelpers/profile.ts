import {apiPut, apiPost, apiGet, apiDelete } from "./apiMiddleware";
import { store } from "@/redux/store";

export interface VehicleData {
  id: string;
  userId: string;
  vehicleType: string;
  make: string;
  model: string;
  customName: string | null;
  year: number | null;
  plateNumber: string;
  emissionFactor: string;
  totalMileage: string;
  totalCarbonSaved: string;
  lastUploadDate: string | null;
  isActive: boolean;
  isPrimary: boolean;
  vehicleImageUrl: string | null;
  detectedFeatures: string | null;
  aiConfidenceScore: number | null;
  fuelType: string;
  batteryCapacity: number;
  rangeKm: number | null;
  manufacturingCountry: string | null;
  color: string | null;
  vin: string;
  insuranceInfo: {
    provider: string;
    policy: string;
  };
  maintenanceInfo: {
    lastService: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Get Vehicles
export const getUserVehicles = (): Promise<VehicleData[]> => {
  // Get current token from Redux store
  const state = store.getState();

  // after update auth token arrive, update the token in the store
  // const currentToken = state.user.accessToken;
  const currentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiaXNBY3RpdmUiOnRydWUsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTM1MzA4MjMsImV4cCI6MTc1NDEzNTYyM30.H1GKksGB5lxNAj3iQki_fO1UBeDvr60c2NvMlmc_rC8";

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiGet<VehicleData[]>(`/vehicles`, {
    requireAuth: false,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  }).then((response) => {
    return response;
  });
};

// Add Vehicle
export const addVehicle = (vehicle: { model: string; vehicleType: string; plateNumber: string }): Promise<any> => {
  const state = store.getState();
  const currentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiaXNBY3RpdmUiOnRydWUsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTM1MzA4MjMsImV4cCI6MTc1NDEzNTYyM30.H1GKksGB5lxNAj3iQki_fO1UBeDvr60c2NvMlmc_rC8";

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiPost(`/vehicles`, vehicle, {
    requireAuth: false,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Delete Vehicle
export const deleteVehicle = (vehicleId: string): Promise<any> => {
  const state = store.getState();
  const currentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiaXNBY3RpdmUiOnRydWUsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTM1MzA4MjMsImV4cCI6MTc1NDEzNTYyM30.H1GKksGB5lxNAj3iQki_fO1UBeDvr60c2NvMlmc_rC8";

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiDelete(`/vehicles/${vehicleId}`, {
    requireAuth: false,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Update Vehicle
export const updateVehicle = (vehicleId: string, updates: Partial<VehicleData>): Promise<any> => {
  const state = store.getState();
  const currentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiaXNBY3RpdmUiOnRydWUsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTM1MzA4MjMsImV4cCI6MTc1NDEzNTYyM30.H1GKksGB5lxNAj3iQki_fO1UBeDvr60c2NvMlmc_rC8";

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiPut(`/vehicles/${vehicleId}`, updates, {
    requireAuth: false,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Get User Profile
export const getUserProfile = (): Promise<any> => {
  const state = store.getState();
  const currentToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiaXNBY3RpdmUiOnRydWUsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTM1MzA4MjMsImV4cCI6MTc1NDEzNTYyM30.H1GKksGB5lxNAj3iQki_fO1UBeDvr60c2NvMlmc_rC8";

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiGet(`/user/profile`, {
    requireAuth: false,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};
