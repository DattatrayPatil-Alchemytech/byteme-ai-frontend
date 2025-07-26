import { apiPost, apiGet } from "./apiMiddleware";
import {
  type UserData,
  type LoginResponse,
  type SignatureVerificationData,
} from "./utils";
import { store } from "@/redux/store";

export interface VehicleData {
  id: string;
  userId: string;
  vehicleType: string;
  make: string;
  model: string;
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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZGE3Y2ExYi1iZWQ4LTRmY2QtYjA1MS05ZmI0MWU0NzgzM2UiLCJ3YWxsZXRBZGRyZXNzIjoiMHhkYTQwYzViZWRiMmRiZjk0ZTBkY2Q2OTE0OTc2MDEwNjQyMmNiZjExIiwiZW1haWwiOiJkaGFyYUBhbGNoZW15dGVjaC5jYSIsImlhdCI6MTc1MzUxMTAzMiwiZXhwIjoxNzUzNTk3NDMyfQ.9b4NetYOp685mztsEOx7nuZk7YRpVUvIESpb3GNeFM0";

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
    console.log("response", response);
    return response;
  });
};

// Export types for use in components
export type { UserData, LoginResponse, SignatureVerificationData };
