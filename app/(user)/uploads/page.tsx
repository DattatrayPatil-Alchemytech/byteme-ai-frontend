"use client";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Upload,
  Camera,
  CheckCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
  Eye,
} from "lucide-react";
import { Button } from "@/app/components/button";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setVehicleDetails,
  setUploadedImage,
  setUploadedFile,
  setUploading,
  setUploadResponse,
  setFetchingDetails,
  setUploadDetails,
  setFetchError,
  setFailedUploadDetails,
  resetOdometer,
} from "@/redux/odometerSlice";
import {
  uploadOdometerImage,
  fetchUploadDetails,
} from "@/lib/apiHelpers/odometer";
import toast from "react-hot-toast";

// Vehicle type options
const vehicleTypes = [
  { value: "two-wheeler-bike", label: "Two Wheeler / Bike" },
  { value: "two-wheeler-scooter", label: "Two Wheeler / Scooter" },
  { value: "three-wheeler", label: "Three Wheeler" },
  { value: "four-wheeler", label: "Four Wheeler" },
];

export default function UploadsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    vehicleDetails,
    uploadedImage,
    uploadedFile,
    isUploading,
    isFetchingDetails,
    uploadDetails,
    uploadResponse,
  } = useSelector((state: RootState) => state.odometer);

  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to handle API failures
  const handleApiFailure = (error: unknown, uploadId?: string, isFetchError = false) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : isFetchError ? "Failed to fetch details" : "Upload failed";
    
    // Set failed upload details in Redux
    dispatch(setFailedUploadDetails({ uploadId, errorMessage }));
    
    // Show toast notification
    toast.error(errorMessage);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndReadImage(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndReadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Validate and read image
  const validateAndReadImage = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid image format. Only JPG, PNG, or HEIC images are allowed."
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size allowed is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      dispatch(setUploadedImage(imageData));
      dispatch(setUploadedFile(file));
    };
    reader.readAsDataURL(file);
  };

  // Handle vehicle details change
  const handleVehicleDetailsChange = (
    field: keyof typeof vehicleDetails,
    value: string
  ) => {
    dispatch(setVehicleDetails({ [field]: value }));
  };

  // Upload image and extract details
  const handleExtractDetails = async () => {
    if (!uploadedImage || !uploadedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    if (
      !vehicleDetails.numberPlate.trim() ||
      !vehicleDetails.vehicleName.trim()
    ) {
      toast.error("Please fill in all vehicle details.");
      return;
    }

    console.log(vehicleDetails, uploadedFile);

    toast("Uploading image and extracting details...");
    dispatch(setUploading(true));

    try {
      // Upload image and get upload ID
      const response = await uploadOdometerImage(uploadedFile, vehicleDetails);

      dispatch(
        setUploadResponse({
          uploadId: response.uploadId,
          status: response.status,
          processingTime: response.processingTime,
        })
      );

      toast.success("Upload successful! Fetching details...");

      // Wait 2 seconds then fetch details
      setTimeout(async () => {
        if (response.uploadId) {
          dispatch(setFetchingDetails(true));

          try {
            const detailsResponse = await fetchUploadDetails(response.uploadId);

            dispatch(setUploadDetails(detailsResponse));

            // Handle different statuses and show appropriate messages
            if (
              detailsResponse.status === "completed" &&
              detailsResponse.isApproved
            ) {
              toast.success(
                "Odometer reading successfully extracted and approved!"
              );
            } else if (detailsResponse.status === "failed") {
              const errorMsg =
                detailsResponse.validationNotes || "Upload processing failed";
              toast.error(errorMsg);
              dispatch(setFetchError(errorMsg));
            } else if (detailsResponse.validationStatus === "rejected") {
              const rejectMsg =
                detailsResponse.validationNotes || "Upload was rejected";
              toast.error(rejectMsg);
              dispatch(setFetchError(rejectMsg));
            } else if (detailsResponse.status === "processing") {
              toast.success("Upload is still being processed. Please wait...");
            } else {
              toast.success("Upload details fetched successfully!");
            }
          } catch (error) {
            dispatch(setFetchError(
              error instanceof Error ? error.message : "Failed to fetch details"
            ));
            
            // Use helper function to handle the failure with upload ID
            handleApiFailure(error, response.uploadId, true);
          } finally {
            dispatch(setFetchingDetails(false));
          }
        }
      }, 2000);
    } catch (error) {
      dispatch(
        setUploadResponse({
          uploadId: "",
          status: "failed",
          processingTime: 0,
        })
      );
      
      // Use helper function to handle the failure
      handleApiFailure(error);
    } finally {
      dispatch(setUploading(false));
    }
  };

  // Reset form
  const handleReset = () => {
    dispatch(resetOdometer());
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Clear any existing file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle click on upload area
  const handleClick = () => {
    inputRef.current?.click();
  };

    return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="border border-border rounded-xl p-6 bg-card">
        {/* Initial Upload Form - Show when no processing or results */}
        {!uploadResponse && !uploadDetails && (
          <>
            <div className="flex items-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-muted-foreground" />
              <span className="font-bold text-lg text-foreground">
                Upload Odometer Photo
              </span>
          </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Take a clear photo of your vehicle&apos;s odometer to verify your
              mileage
            </p>
            {/* Image Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition hover:border-green-400 mb-6"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded odometer"
                      width={300}
                      height={200}
                      className="rounded-lg max-w-xs mx-auto"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <Button variant="outline" onClick={handleClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              ) : (
                <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop your odometer photo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, HEIC (Max 10MB)
                    </p>
        </div>
                  <Button
                    size="lg"
                    className="gradient-ev-green text-white mt-4"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </>
              )}
              <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleFileUpload}
                accept="image/*"
              />
            </div>
            
            {/* Vehicle Details Form */}
            {uploadedImage && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Vehicle Details</h3>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleDetails.vehicleType}
                    onChange={(e) =>
                      handleVehicleDetailsChange("vehicleType", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {vehicleTypes.map((type) => {
                      return (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Number Plate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number Plate
                  </label>
                  <input
                    type="text"
                    value={vehicleDetails.numberPlate}
                    onChange={(e) =>
                      handleVehicleDetailsChange("numberPlate", e.target.value)
                    }
                    placeholder="Enter vehicle number plate"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Vehicle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    value={vehicleDetails.vehicleName}
                    onChange={(e) =>
                      handleVehicleDetailsChange("vehicleName", e.target.value)
                    }
                    placeholder="Enter vehicle name/model"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Extract Details Button */}
                <Button
                  onClick={handleExtractDetails}
                  disabled={
                    isUploading ||
                    isFetchingDetails ||
                    !uploadedImage ||
                    !vehicleDetails.numberPlate.trim() ||
                    !vehicleDetails.vehicleName.trim()
                  }
                  className="w-full gradient-ev-green text-white"
                  size="lg"
                >
                  {isUploading || isFetchingDetails ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isUploading ? "Uploading..." : "Fetching Details..."}
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5 mr-2" />
                      Extract Details
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Processing Status - Show when uploading and no details fetched yet */}
        {uploadResponse &&
          uploadResponse.status === "processing" &&
          !uploadDetails && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold">Processing Upload</h2>
              <p className="text-muted-foreground">
                Your image is being processed. This may take a few moments.
              </p>
              <div className="text-sm text-muted-foreground">
                Processing Time: {uploadResponse.processingTime}ms
              </div>
              <div className="text-sm text-muted-foreground">
                Upload ID: {uploadResponse.uploadId}
              </div>
            </div>
          )}

        {/* Success Results - Show when details are fetched and approved */}
        {uploadDetails &&
          uploadDetails.isApproved &&
          uploadDetails.status === "completed" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
              <h2 className="text-2xl font-bold">Odometer Reading Extracted</h2>

              <div className="text-4xl font-bold text-green-600">
                {uploadDetails.extractedMileage?.toLocaleString() ||
                  uploadDetails.finalMileage?.toLocaleString() ||
                  "0"}{" "}
                KM
        </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Confidence: </span>
                  <span
                    className={`font-medium ${
                      (uploadDetails.ocrConfidenceScore || 0) > 70
                        ? "text-green-600"
                        : (uploadDetails.ocrConfidenceScore || 0) > 40
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {uploadDetails.ocrConfidenceScore || 0}%
                </span>
              </div>
              <div>
                  <span className="text-muted-foreground">Vehicle: </span>
                  <span className="font-medium">{uploadDetails.vehicleId}</span>
              </div>
            </div>
            
              {uploadDetails.carbonSaved && (
                <div className="text-sm text-green-600">
                  Carbon Saved: {uploadDetails.carbonSaved} kg CO2
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">API Response Details</h4>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(uploadDetails, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Upload New Image
                </Button>
          </div>
        </div>
          )}

        {/* Failed/Rejected Status - Show when details are fetched and failed/rejected */}
        {uploadDetails &&
          (uploadDetails.status === "failed" ||
            uploadDetails.validationStatus === "rejected") && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600">
                {uploadDetails.status === "failed"
                  ? "Upload Failed"
                  : "Upload Rejected"}
              </h2>
              <p className="text-red-600">
                {uploadDetails.validationNotes || "Upload processing failed"}
              </p>
              <div className="text-sm text-muted-foreground">
                Upload ID: {uploadDetails.id}
              </div>
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                    Upload New Vehicle and Try Again
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* Upload Tips */}
      <div className="border border-border rounded-xl p-6 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg text-foreground">
            📋 Upload Tips for Best Results
          </span>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          Follow these guidelines for accurate odometer reading
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
          <li>Ensure the odometer digits are clearly visible and well-lit</li>
          <li>Take the photo straight-on to avoid distortion</li>
          <li>Make sure there&apos;s no glare or reflection on the display</li>
          <li>Focus on the odometer area - crop out unnecessary parts</li>
          <li>Use good lighting conditions and avoid shadows</li>
          <li>Ensure the numbers are sharp and not blurry</li>
          <li>
            Try to capture the &quot;km&quot; or &quot;KM&quot; text along with
            the numbers
          </li>
        </ul>
        </div>
      </div>
    );
  }
