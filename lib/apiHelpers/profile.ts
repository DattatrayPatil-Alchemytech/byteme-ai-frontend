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
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiGet<VehicleData[]>(`/vehicles`, {
    requireAuth: true,
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
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiPost(`/vehicles`, vehicle, {
    requireAuth: true,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Delete Vehicle
export const deleteVehicle = (vehicleId: string): Promise<any> => {
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiDelete(`/vehicles/${vehicleId}`, {
    requireAuth: true,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Update Vehicle
export const updateVehicle = (vehicleId: string, updates: Partial<VehicleData>): Promise<any> => {
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiPut(`/vehicles/${vehicleId}`, updates, {
    requireAuth: true,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};

// Get User Profile
export const getUserProfile = (): Promise<any> => {
  const state = store.getState();
  const currentToken = state.user.accessToken;

  if (!currentToken) {
    throw new Error("No access token found");
  }

  return apiGet(`/user/profile`, {
    requireAuth: true,
    showToast: false,
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  });
};
