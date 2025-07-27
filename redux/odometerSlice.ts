import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type UploadDetailsResponse } from '@/lib/apiHelpers/odometer';
import { type VehicleData } from '@/lib/apiHelpers/profile';

// Types
export interface VehicleDetails {
  vehicleType: 'two-wheeler-bike' | 'two-wheeler-scooter' | 'three-wheeler' | 'four-wheeler';
  numberPlate: string;
  vehicleName: string;
  vehicleId?: string;
}

export interface OdometerExtraction {
  kilometers: number;
  confidence: number;
  rawText: string;
  extractedText: string;
}

export interface ClientSideOCRResult {
  kilometers: number;
  confidence: number;
  originalText: string;
  patternUsed: number;
}

export interface UploadResponse {
  uploadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime: number;
}

export interface OdometerState {
  // Form data
  vehicleDetails: VehicleDetails;
  
  // Upload state
  uploadedImage: string | null;
  uploadedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  
  // Client-side OCR state
  isProcessingOCR: boolean;
  ocrProcessingStep: string;
  clientSideOCRResult: ClientSideOCRResult | null;
  ocrError: string | null;
  
  // API state
  uploadId: string | null;
  uploadResponse: UploadResponse | null;
  isFetchingDetails: boolean;
  uploadDetails: UploadDetailsResponse | null;
  fetchError: string | null;
  
  // Vehicles state
  vehicles: VehicleData[];
  vehiclesLoading: boolean;
  vehiclesError: string | null;
}

const initialState: OdometerState = {
  vehicleDetails: {
    vehicleType: 'two-wheeler-bike',
    numberPlate: '',
    vehicleName: ''
  },
  uploadedImage: null,
  uploadedFile: null,
  isUploading: false,
  uploadProgress: 0,
  isProcessingOCR: false,
  ocrProcessingStep: '',
  clientSideOCRResult: null,
  ocrError: null,
  uploadId: null,
  uploadResponse: null,
  isFetchingDetails: false,
  uploadDetails: null,
  fetchError: null,
  vehicles: [],
  vehiclesLoading: false,
  vehiclesError: null
};

const odometerSlice = createSlice({
  name: 'odometer',
  initialState,
  reducers: {
    setVehicleDetails: (state, action: PayloadAction<Partial<VehicleDetails>>) => {
      state.vehicleDetails = { ...state.vehicleDetails, ...action.payload };
    },
    setUploadedImage: (state, action: PayloadAction<string>) => {
      state.uploadedImage = action.payload;
    },
    setUploadedFile: (state, action: PayloadAction<File>) => {
      state.uploadedFile = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setUploadResponse: (state, action: PayloadAction<UploadResponse>) => {
      state.uploadResponse = action.payload;
      state.uploadId = action.payload.uploadId;
    },
    setFetchingDetails: (state, action: PayloadAction<boolean>) => {
      state.isFetchingDetails = action.payload;
    },
    setUploadDetails: (state, action: PayloadAction<UploadDetailsResponse | null>) => {
      state.uploadDetails = action.payload;
    },
    setFetchError: (state, action: PayloadAction<string | null>) => {
      state.fetchError = action.payload;
    },
    setFailedUploadDetails: (state, action: PayloadAction<{ uploadId?: string; errorMessage: string }>) => {
      const { uploadId = "", errorMessage } = action.payload;
      state.uploadDetails = {
        id: uploadId,
        userId: "",
        vehicleId: "",
        s3ImageUrl: "",
        s3ThumbnailUrl: "",
        imageHash: "",
        status: "failed",
        validationStatus: "rejected",
        validationNotes: errorMessage,
        isApproved: false,
        extractedMileage: null,
        finalMileage: null,
        ocrConfidenceScore: null,
        ocrRawText: null,
        openaiAnalysis: null,
        vehicleDetected: null,
        aiValidationResult: null,
        mileageDifference: null,
        carbonSaved: "0",
        emissionFactorUsed: null,
        processingTimeMs: null,
        ocrProcessingTimeMs: null,
        aiProcessingTimeMs: null,
        fileSizeBytes: 0,
        imageDimensions: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        processedAt: null,
      };
    },
    setProcessingOCR: (state, action: PayloadAction<boolean>) => {
      state.isProcessingOCR = action.payload;
    },
    setOCRProcessingStep: (state, action: PayloadAction<string>) => {
      state.ocrProcessingStep = action.payload;
    },
    setClientSideOCRResult: (state, action: PayloadAction<ClientSideOCRResult | null>) => {
      state.clientSideOCRResult = action.payload;
    },
    setOCRError: (state, action: PayloadAction<string | null>) => {
      state.ocrError = action.payload;
    },
    setVehicles: (state, action: PayloadAction<VehicleData[]>) => {
      state.vehicles = action.payload;
    },
    setVehiclesLoading: (state, action: PayloadAction<boolean>) => {
      state.vehiclesLoading = action.payload;
    },
    setVehiclesError: (state, action: PayloadAction<string | null>) => {
      state.vehiclesError = action.payload;
    },
    resetOdometer: (state) => {
      return initialState;
    }
  }
});

export const {
  setVehicleDetails,
  setUploadedImage,
  setUploadedFile,
  setUploadProgress,
  setUploading,
  setUploadResponse,
  setFetchingDetails,
  setUploadDetails,
  setFetchError,
  setFailedUploadDetails,
  setProcessingOCR,
  setOCRProcessingStep,
  setClientSideOCRResult,
  setOCRError,
  setVehicles,
  setVehiclesLoading,
  setVehiclesError,
  resetOdometer
} = odometerSlice.actions;

export default odometerSlice.reducer; 