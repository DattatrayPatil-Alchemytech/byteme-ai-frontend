import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type UploadDetailsResponse } from '@/lib/apiHelpers/odometer';

// Types
export interface VehicleDetails {
  vehicleType: 'two-wheeler-bike' | 'two-wheeler-scooter' | 'three-wheeler' | 'four-wheeler';
  numberPlate: string;
  vehicleName: string;
}

export interface OdometerExtraction {
  kilometers: number;
  confidence: number;
  rawText: string;
  extractedText: string;
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
  
  // API state
  uploadId: string | null;
  uploadResponse: UploadResponse | null;
  isFetchingDetails: boolean;
  uploadDetails: UploadDetailsResponse | null;
  fetchError: string | null;
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
  uploadId: null,
  uploadResponse: null,
  isFetchingDetails: false,
  uploadDetails: null,
  fetchError: null
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
  resetOdometer
} = odometerSlice.actions;

export default odometerSlice.reducer; 