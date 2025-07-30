import { apiPost, apiGet } from "./apiMiddleware";
import { VehicleDetails } from "@/redux/odometerSlice";

// Types for API responses
export interface UploadOdometerResponse {
  uploadId: string;
  status: "pending" | "processing" | "completed" | "failed";
  processingTime: number;
}

// Types for vehicle details API
export interface VehicleDetailsRequest {
  vehicleType?: string;
  customName?: string;
  make?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  emissionFactor?: number;
}

export interface VehicleDetailsResponse {
  success: boolean;
  message: string;
  vehicleId?: string;
}

export interface UploadDetailsResponse {
  id: string;
  userId: string;
  vehicleId: string;
  s3ImageUrl: string;
  s3ThumbnailUrl: string;
  imageHash: string;
  extractedMileage: number | null;
  ocrConfidenceScore: number | null;
  ocrRawText: string | null;
  openaiAnalysis: string | null;
  vehicleDetected: string | null;
  aiValidationResult: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "success";
  validationStatus: "pending" | "approved" | "rejected";
  validationNotes: string | null;
  isApproved: boolean;
  finalMileage: number | null;
  mileageDifference: number | null;
  carbonSaved: string;
  emissionFactorUsed: string | null;
  processingTimeMs: number | null;
  ocrProcessingTimeMs: number | null;
  aiProcessingTimeMs: number | null;
  fileSizeBytes: number;
  totalDistanceAllTime?: number | null;
  imageDimensions: string;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
}

// Upload odometer image with vehicle details
export const uploadOdometerImage = async (
  imageFile: File,
  vehicleDetails: VehicleDetails,
  isAuthenticated?: boolean
): Promise<UploadOdometerResponse> => {
  // Create FormData for multipart upload according to Swagger spec
  const formData = new FormData();
  formData.append("image", imageFile);
  if (isAuthenticated) {
    if (vehicleDetails.vehicleId !== undefined) {
      formData.append("vehicleId", vehicleDetails.vehicleId);
    }
  } 
  // else {
  //   if (vehicleDetails.numberPlate !== undefined) {
  //     formData.append("vehicleId", vehicleDetails.numberPlate);
  //     // Create notes object with vehicle type and name
  //     const notes = {
  //       type: vehicleDetails.vehicleType,
  //       name: vehicleDetails.vehicleName,
  //     };
  //     formData.append("notes", JSON.stringify(notes));
  //   }
  // }

  return apiPost<UploadOdometerResponse>("/odometer/upload", formData, {
    requireAuth: isAuthenticated,
    showToast: false,
  });
};

// Fetch upload details by uploadId
export const fetchUploadDetails = async (
  uploadId: string,
  isAuthenticated?: boolean
): Promise<UploadDetailsResponse> => {
  return apiGet<UploadDetailsResponse>(`/odometer/uploads/${uploadId}`, {
    requireAuth: isAuthenticated,
    showToast: false,
  });
};

// Fetch upload details by uploadId
export const linktoUpload = async (
  uploadId: string
): Promise<UploadDetailsResponse> => {
  return apiPost<UploadDetailsResponse>(`/odometer/uploads/${uploadId}/link`, {
    requireAuth: false,
    showToast: false,
  });
};

// Upload vehicle details for an odometer upload
export const uploadVehicleDetails = async (
  uploadId: string,
  vehicleDetails: VehicleDetailsRequest
): Promise<VehicleDetailsResponse> => {
  return apiPost<VehicleDetailsResponse>(
    `/odometer/upload/${uploadId}/vehicle`,
    vehicleDetails,
    {
      requireAuth: true,
      showToast: false,
    }
  );
};

// Export types for use in components
export type { VehicleDetails };
