"use client";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
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
  setProcessingOCR,
  setOCRProcessingStep,
  setClientSideOCRResult,
  setOCRError,
  setVehicles,
  setVehiclesLoading,
  setVehiclesError,
  resetOdometer,
} from "@/redux/odometerSlice";
import {
  uploadOdometerImage,
  fetchUploadDetails,
  linktoUpload,
} from "@/lib/apiHelpers/odometer";
import { getUserVehicles, addVehicle } from "@/lib/apiHelpers/profile";
import toast from "react-hot-toast";
import WalletConnect from "@/components/auth/WalletConnect";
import AddVehicleModal from "@/components/modals/AddVehicleModal";

// Tesseract types
interface TesseractLogger {
  status: string;
  progress?: number;
}

interface TesseractInstance {
  recognize: (
    image: string,
    lang: string,
    options: {
      logger?: (m: TesseractLogger) => void;
      tessedit_pageseg_mode?: number;
      tessedit_char_whitelist?: string;
      preserve_interword_spaces?: string;
    }
  ) => Promise<{ data: { text: string } }>;
  PSM: {
    SPARSE_TEXT: number;
  };
}

// Load Tesseract.js dynamically on client side
const loadTesseract = async () => {
  if (typeof window !== "undefined") {
    const Tesseract = await import("tesseract.js");
    return Tesseract.default;
  }
  return null;
};

// Vehicle type mapping for OCR
const vehicleTypeMapping = {
  "two-wheeler-bike": "2wheeler",
  "two-wheeler-scooter": "2wheeler",
  "three-wheeler": "3wheeler",
  "four-wheeler": "4wheeler",
} as const;

type VehicleType = "2wheeler" | "3wheeler" | "4wheeler";

interface KmMatch {
  value: number;
  originalText: string;
  confidence: number;
  patternUsed: number;
}

interface VehiclePatterns {
  [key: string]: RegExp[];
}

interface VehicleRanges {
  [key: string]: { min: number; max: number };
}

// Vehicle type options
const vehicleTypes = [
  { value: "two-wheeler-bike", label: "Two Wheeler / Bike" },
  { value: "two-wheeler-scooter", label: "Two Wheeler / Scooter" },
  { value: "three-wheeler", label: "Three Wheeler" },
  { value: "four-wheeler", label: "Four Wheeler" },
];

// Advanced image preprocessing for better OCR accuracy
const preprocessImageForOCR = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  vehicleType: VehicleType
): string => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Step 1: Convert to grayscale with better contrast
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Weighted grayscale conversion
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    // Apply different thresholding based on vehicle type
    let threshold = 128;
    if (vehicleType === "2wheeler") threshold = 110; // More sensitive for smaller displays
    if (vehicleType === "3wheeler") threshold = 120;

    const binary = gray > threshold ? 255 : 0;

    data[i] = binary; // R
    data[i + 1] = binary; // G
    data[i + 2] = binary; // B
    data[i + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);

  // Step 2: Apply morphological operations to clean up noise
  const cleanedImageData = ctx.getImageData(0, 0, width, height);
  const cleanedData = cleanedImageData.data;

  // Simple erosion to remove noise
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      if (data[idx] === 0) {
        // If current pixel is black
        let blackNeighbors = 0;

        // Check 3x3 neighborhood
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            if (data[nIdx] === 0) blackNeighbors++;
          }
        }

        // Keep black pixel only if it has enough black neighbors
        if (blackNeighbors < 3) {
          cleanedData[idx] = cleanedData[idx + 1] = cleanedData[idx + 2] = 255;
        }
      }
    }
  }

  ctx.putImageData(cleanedImageData, 0, 0);
  return canvas.toDataURL("image/png");
};

// Enhanced kilometer extraction with better patterns
const extractKilometersAdvanced = (
  ocrText: string,
  vehicleType: VehicleType
): KmMatch | null => {
  console.log("OCR Raw Text:", ocrText);

  // Clean the OCR text
  const cleanText = ocrText
    .replace(/[|]/g, "1") // Common OCR mistake: | instead of 1
    .replace(/[O]/g, "0") // O instead of 0
    .replace(/[S]/g, "5") // S instead of 5
    .replace(/[l]/g, "1") // l instead of 1
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .trim();

  console.log("Cleaned Text:", cleanText);

  // Vehicle-specific patterns - more comprehensive
  const patterns: VehiclePatterns = {
    "2wheeler": [
      // Standard patterns for 2-wheelers
      /(?:total|odo|odometer|km|kilometers?)[\s:]*(\d{3,6}(?:[,.]?\d{1,3})?)/gi,
      /(\d{4,6}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?|k)/gi,
      // Digital display patterns
      /(\d{5,6})\s*(?:\.|,)?\s*\d{1}\s*(?:km|k)?/gi,
      // Just numbers that look like odometer readings
      /\b(\d{4,6})\b/g,
    ],
    "3wheeler": [
      /(?:total|odo|odometer)[\s:]*(\d{4,6}(?:[,.]?\d{1,3})?)/gi,
      /(\d{4,6}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?)/gi,
      /\b(\d{5,6})\b/g,
    ],
    "4wheeler": [
      /(?:total|odometer|odo)[\s:]*(\d{4,7}(?:[,.]?\d{1,3})?)/gi,
      /(\d{5,7}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?)/gi,
      /\b(\d{5,7})\b/g,
    ],
  };

  const vehiclePatterns = patterns[vehicleType] || patterns["4wheeler"];
  const matches: KmMatch[] = [];

  vehiclePatterns.forEach((pattern, patternIndex) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);

    while ((match = regex.exec(cleanText)) !== null) {
      const rawValue = match[1].replace(/[,\s]/g, "");
      const numValue = parseInt(rawValue, 10);

      // Vehicle-specific validation ranges
      const ranges: VehicleRanges = {
        "2wheeler": { min: 100, max: 150000 }, // 100 km to 150,000 km
        "3wheeler": { min: 500, max: 500000 }, // 500 km to 500,000 km
        "4wheeler": { min: 1000, max: 999999 }, // 1,000 km to 999,999 km
      };

      const range = ranges[vehicleType] || ranges["4wheeler"];

      if (!isNaN(numValue) && numValue >= range.min && numValue <= range.max) {
        const confidence = calculateAdvancedConfidence(
          match[0],
          cleanText,
          vehicleType,
          patternIndex,
          numValue
        );

        matches.push({
          value: numValue,
          originalText: match[0],
          confidence: confidence,
          patternUsed: patternIndex,
        });

        console.log(`Found match: ${numValue} (confidence: ${confidence}%)`);
      }
    }
  });

  // Sort by confidence and return best match
  const bestMatch = matches.sort((a, b) => b.confidence - a.confidence)[0];
  console.log("Best match:", bestMatch);

  return bestMatch || null;
};

const calculateAdvancedConfidence = (
  matchText: string,
  fullText: string,
  vehicleType: VehicleType,
  patternIndex: number,
  numValue: number
): number => {
  let confidence = 40; // Base confidence

  // Boost for specific keywords
  if (/total|odo|odometer/i.test(matchText)) confidence += 25;
  if (/km|kilometers?/i.test(matchText)) confidence += 20;

  // Boost for reasonable number length
  const numStr = numValue.toString();
  if (vehicleType === "2wheeler" && numStr.length >= 4 && numStr.length <= 5)
    confidence += 15;
  if (vehicleType === "3wheeler" && numStr.length >= 4 && numStr.length <= 6)
    confidence += 15;
  if (vehicleType === "4wheeler" && numStr.length >= 5 && numStr.length <= 6)
    confidence += 15;

  // Boost for pattern specificity (earlier patterns are more specific)
  confidence += (3 - patternIndex) * 5;

  // Penalty for very high numbers that seem unrealistic
  if (numValue > 500000) confidence -= 20;
  if (numValue > 200000 && vehicleType === "2wheeler") confidence -= 30;

  // Boost if number appears in context
  const contextWords = fullText.toLowerCase();
  if (contextWords.includes("distance") || contextWords.includes("traveled"))
    confidence += 10;

  return Math.min(Math.max(confidence, 10), 95); // Keep between 10-95%
};

export default function UploadsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const {
    vehicleDetails,
    uploadedImage,
    uploadedFile,
    isUploading,
    isFetchingDetails,
    uploadDetails,
    uploadResponse,
    isProcessingOCR,
    ocrProcessingStep,
    clientSideOCRResult,
    ocrError,
    vehicles,
    vehiclesLoading,
    vehiclesError,
  } = useSelector((state: RootState) => state.odometer);

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tesseract, setTesseract] = useState<TesseractInstance | null>(null);
  const hasCalledVehiclesAPI = useRef(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [addVehicleLoading, setAddVehicleLoading] = useState(false);

  // Load Tesseract.js on component mount
  useEffect(() => {
    loadTesseract().then((tesseractInstance) => {
      if (tesseractInstance) {
        setTesseract(tesseractInstance as unknown as TesseractInstance);
      }
    });
  }, []);

  // Clear old Redux state when component mounts (first visit to uploads page)
  useEffect(() => {
    // Reset all state to initial values - this should clear everything
    dispatch(resetOdometer());

    // Clear file input if it exists
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Reset the API call flag when component mounts
    hasCalledVehiclesAPI.current = false;
  }, [dispatch]);

  // Call getVehicles API if user is authenticated - run after reset
  useEffect(() => {
    let isMounted = true;

    const fetchVehicles = async () => {
      // Check if user is authenticated, component is still mounted, and API hasn't been called yet
      if (isMounted && isAuthenticated && !hasCalledVehiclesAPI.current) {
        hasCalledVehiclesAPI.current = true; // Mark as called to prevent duplicate calls

        try {
          dispatch(setVehiclesLoading(true));
          dispatch(setVehiclesError(null));

          const vehicles = await getUserVehicles();

          // Check if component is still mounted before updating state
          if (isMounted) {
            dispatch(setVehicles(vehicles));
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching vehicles:", error);
            dispatch(
              setVehiclesError(
                error instanceof Error
                  ? error.message
                  : "Failed to fetch vehicles"
              )
            );
            toast.error("Failed to load vehicles");
          }
        } finally {
          if (isMounted) {
            dispatch(setVehiclesLoading(false));
          }
        }
      }
    };

    fetchVehicles();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Helper function to handle API failures
  const handleApiFailure = (
    error: unknown,
    uploadId?: string,
    isFetchError = false
  ) => {
    const errorMessage =
      error instanceof Error
        ? error.message
        : isFetchError
        ? "Failed to fetch details"
        : "Upload failed";

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

  // Client-side OCR processing function
  const processImageWithOCR = async () => {
    if (!uploadedImage || !tesseract) {
      dispatch(
        setOCRError(
          "Tesseract not loaded yet. Please wait a moment and try again."
        )
      );
      return;
    }

    dispatch(setProcessingOCR(true));
    dispatch(setOCRError(null));
    dispatch(setOCRProcessingStep("Preprocessing image..."));

    try {
      // Step 1: Preprocess image
      const processedImage = await new Promise<string>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Get image data and preprocess
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const vehicleType =
            vehicleTypeMapping[vehicleDetails.vehicleType] || "4wheeler";
          const processedDataURL = preprocessImageForOCR(
            canvas,
            ctx,
            imageData,
            vehicleType
          );

          resolve(processedDataURL);
        };
        img.src = uploadedImage;
      });

      // Step 2: Perform OCR with optimized settings
      dispatch(setOCRProcessingStep("Performing OCR..."));

      const {
        data: { text },
      } = await tesseract.recognize(processedImage, "eng", {
        logger: (m: TesseractLogger) => {
          if (m.status === "recognizing text" && m.progress !== undefined) {
            dispatch(
              setOCRProcessingStep(
                `OCR Progress: ${Math.round(m.progress * 100)}%`
              )
            );
          }
        },
        tessedit_pageseg_mode: tesseract.PSM.SPARSE_TEXT,
        tessedit_char_whitelist: "0123456789.,KMkmTotalODODistancekilometers ",
        preserve_interword_spaces: "1",
      });

      dispatch(setOCRProcessingStep("Extracting kilometers..."));

      // Step 3: Extract kilometers
      const vehicleType =
        vehicleTypeMapping[vehicleDetails.vehicleType] || "4wheeler";
      const kmData = extractKilometersAdvanced(text, vehicleType);

      if (kmData && kmData.confidence > 30) {
        dispatch(
          setClientSideOCRResult({
            kilometers: kmData.value,
            confidence: kmData.confidence,
            originalText: kmData.originalText,
            patternUsed: kmData.patternUsed,
          })
        );
        dispatch(setOCRProcessingStep("Complete!"));
        // Don't show toast here since it's running in background
      } else {
        const errorMsg = `Could not reliably extract kilometers from the odometer. 
                         ${
                           kmData
                             ? `Best guess: ${kmData.value} km (${kmData.confidence}% confidence)`
                             : ""
                         }
                         Please ensure the image shows the odometer clearly with good lighting.`;
        dispatch(setOCRError(errorMsg));
        // Don't show toast here since it's running in background
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      dispatch(setOCRError("Failed to process image: " + errorMessage));
      // Don't show toast here since it's running in background
      console.error("OCR Error:", err);
    } finally {
      dispatch(setProcessingOCR(false));
      dispatch(setOCRProcessingStep(""));
    }
  };

  const retryWithDelay = async (
    uploadId: string,
    retryCount: number = 5,
    delay: number = 5000
  ) => {
    let detailsResponse;
    if (retryCount > 1) {
      try {
        await new Promise((resolve) => setTimeout(resolve, delay));
        detailsResponse = await fetchUploadDetails(uploadId);
        if (
          detailsResponse?.status === "completed" &&
          detailsResponse?.isApproved
        ) {
          toast.success(
            "Odometer reading successfully extracted and approved!"
          );
          return detailsResponse;
        } else {
          return retryWithDelay(uploadId, retryCount - 1, delay);
        }
      } catch (error) {
        console.error(
          `Error fetching upload details on attempt ${retryCount}:`,
          error
        );
        retryWithDelay(uploadId, retryCount - 1, delay);
      }
    } else {
      return detailsResponse;
    }
  };

  // Upload image and extract details
  const handleExtractDetails = async () => {
    if (!uploadedImage || !uploadedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    // Different validation based on authentication status
    if (isAuthenticated) {
      if (!vehicleDetails.vehicleId) {
        toast.error("Please select a vehicle.");
        return;
      }
    } else {
      if (
        !vehicleDetails.numberPlate.trim() ||
        !vehicleDetails.vehicleName.trim()
      ) {
        toast.error("Please fill in all vehicle details.");
        return;
      }
    }

    toast("Uploading image and extracting details...");
    dispatch(setUploading(true));

    // Start client-side OCR in background if Tesseract is available
    let backgroundOCRPromise: Promise<void> | null = null;
    if (tesseract) {
      backgroundOCRPromise = processImageWithOCR();
    }

    try {
      // Upload image and get upload ID
      const response = await uploadOdometerImage(
        uploadedFile,
        vehicleDetails,
        isAuthenticated
      );

      dispatch(
        setUploadResponse({
          uploadId: response.uploadId,
          status: response.status,
          processingTime: response.processingTime,
        })
      );

      toast.success("Upload successful! Fetching details...");

      // Long polling for upload details - try up to 5 times
      const pollUploadDetails = async (uploadId: string, maxAttempts = 5) => {
        const detailsResponse = await retryWithDelay(uploadId);

        if (
          detailsResponse?.status === "completed" &&
          detailsResponse?.isApproved
        ) {
          dispatch(setUploadDetails(detailsResponse));
          await linktoUpload(uploadId);
          return;
        } else if (detailsResponse?.status === "failed") {
          const errorMsg = "Upload processing failed";
          // Don't show error toast immediately, wait for OCR
          dispatch(setFetchError(errorMsg));

          // If API fails, wait for background OCR to complete and show results
          if (backgroundOCRPromise) {
            toast("API failed. Trying client-side OCR...");
            await backgroundOCRPromise;
          } else {
            // If no OCR available, then show the error
            toast.error(errorMsg);
          }
          return; // Got response, stop polling
        } else if (detailsResponse?.validationStatus === "rejected") {
          const rejectMsg =
            detailsResponse?.validationNotes || "Upload was rejected";
          // Don't show error toast immediately, wait for OCR
          dispatch(setFetchError(rejectMsg));

          // If API rejects, wait for background OCR to complete and show results
          if (backgroundOCRPromise) {
            toast("API rejected. Trying client-side OCR...");
            await backgroundOCRPromise;
          } else {
            // If no OCR available, then show the error
            toast.error(rejectMsg);
          }
          return; // Got response, stop polling
        }
      };

      // Start polling if we have an upload ID
      if (response.uploadId) {
        dispatch(setFetchingDetails(true));
        await pollUploadDetails(response.uploadId);
        dispatch(setFetchingDetails(false));
      }
    } catch (error) {
      dispatch(
        setUploadResponse({
          uploadId: "",
          status: "failed",
          processingTime: 0,
        })
      );

      // If API fails, wait for background OCR to complete and show results
      if (backgroundOCRPromise) {
        toast("API failed. Trying client-side OCR...");
        await backgroundOCRPromise;
      } else {
        // If no OCR available, then show the error
        handleApiFailure(error);
      }
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

  // Handle navigation to dashboard
  const handleJoinChallenge = () => {
    router.push("/dashboard");
  };

  // Handle adding a new vehicle
  const handleAddVehicle = async (vehicleData: {
    model: string;
    vehicleType: string;
    plateNumber: string;
  }) => {
    setAddVehicleLoading(true);
    try {
      await addVehicle(vehicleData);
      toast.success("Vehicle added successfully!");
      setAddVehicleModalOpen(false);

      // Reset the API call flag to allow refetching vehicles
      hasCalledVehiclesAPI.current = false;

      // Refetch vehicles
      dispatch(setVehiclesLoading(true));
      dispatch(setVehiclesError(null));

      const vehicles = await getUserVehicles();
      dispatch(setVehicles(vehicles));
      dispatch(setVehiclesLoading(false));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add vehicle";
      toast.error(errorMessage);
      throw error; // Re-throw to let the modal handle it
    } finally {
      setAddVehicleLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="border border-border rounded-xl p-6 bg-card">
        {/* Initial Upload Form - Show when no processing or results */}
        {!isUploading && !uploadResponse && !uploadDetails && (
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

                {/* Show different content based on authentication status */}
                {isAuthenticated ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Vehicle
                    </label>

                    {/* Loading skeleton */}
                    {vehiclesLoading && (
                      <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    )}

                    {/* Vehicle select field */}
                    {!vehiclesLoading && vehicles && vehicles.length > 0 && (
                      <select
                        value={vehicleDetails.vehicleId || ""}
                        onChange={(e) => {
                          const selectedVehicle = vehicles.find(
                            (v) => v.id === e.target.value
                          );
                          if (selectedVehicle) {
                            dispatch(
                              setVehicleDetails({
                                vehicleId: selectedVehicle.id,
                              })
                            );
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.model}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Add vehicle button when no vehicles */}
                    {!vehiclesLoading &&
                      (!vehicles || vehicles.length === 0) && (
                        <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500 mb-3">
                            No vehicles found
                          </p>
                          <Button
                            variant="outline"
                            className="gradient-ev-green text-white"
                            onClick={() => setAddVehicleModalOpen(true)}
                          >
                            Add Vehicle
                          </Button>
                        </div>
                      )}

                    {/* Error state */}
                    {vehiclesError && (
                      <div className="text-red-600 text-sm mt-2">
                        {vehiclesError}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleDetails.vehicleType}
                        onChange={(e) =>
                          handleVehicleDetailsChange(
                            "vehicleType",
                            e.target.value
                          )
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
                          handleVehicleDetailsChange(
                            "numberPlate",
                            e.target.value
                          )
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
                          handleVehicleDetailsChange(
                            "vehicleName",
                            e.target.value
                          )
                        }
                        placeholder="Enter vehicle name/model"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Extract Details Button */}
                <Button
                  onClick={handleExtractDetails}
                  disabled={
                    isUploading ||
                    isFetchingDetails ||
                    isProcessingOCR ||
                    !uploadedImage ||
                    (isAuthenticated
                      ? !vehicleDetails.vehicleId
                      : !vehicleDetails.numberPlate.trim() ||
                        !vehicleDetails.vehicleName.trim())
                  }
                  className="w-full gradient-ev-green text-white"
                  size="lg"
                >
                  {isUploading || isFetchingDetails || isProcessingOCR ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isUploading
                        ? "Uploading..."
                        : isFetchingDetails
                        ? "Fetching Details..."
                        : ocrProcessingStep || "Processing..."}
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

        {/* Single Processing Status - Show when any processing is happening (API or OCR) */}
        {(isUploading || isFetchingDetails || isProcessingOCR) && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold">
              {isUploading
                ? "Uploading..."
                : isFetchingDetails
                ? "Fetching Details..."
                : "Processing with Client-side OCR"}
            </h2>
            <p className="text-muted-foreground">
              {isUploading
                ? "Uploading image to server..."
                : isFetchingDetails
                ? "Fetching processing results..."
                : ocrProcessingStep ||
                  "Processing image with client-side OCR..."}
            </p>
            {uploadResponse && uploadResponse.uploadId && (
              <div className="text-sm text-muted-foreground">
                Upload ID: {uploadResponse.uploadId}
              </div>
            )}
          </div>
        )}

        {/* Success Results - Show when API succeeds */}
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
              <div className="flex justify-center">
                {!isAuthenticated && (
                  <WalletConnect
                    title="Connect Wallet and Claim Rewards"
                    className="gradient-ev-green text-white"
                  />
                )}
                {isAuthenticated && (
                  <Button
                    className="gradient-ev-green text-white"
                    variant="outline"
                    onClick={handleJoinChallenge}
                  >
                    Join Challenge From Leaderboard
                  </Button>
                )}
              </div>
            </div>
          )}

        {/* Client-side OCR Success - Show when OCR succeeds (API may have failed) */}
        {clientSideOCRResult &&
          !isProcessingOCR &&
          uploadDetails?.status !== "completed" && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-600">
                Odometer Reading Extracted
              </h2>
              <div className="text-4xl font-bold text-blue-600">
                {clientSideOCRResult.kilometers.toLocaleString()} KM
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Confidence: </span>
                  <span
                    className={`font-medium ${
                      clientSideOCRResult.confidence > 70
                        ? "text-green-600"
                        : clientSideOCRResult.confidence > 40
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {clientSideOCRResult.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Detected: </span>
                  <span className="font-medium">
                    &quot;{clientSideOCRResult.originalText}&quot;
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Upload New Image
                </Button>
              </div>
              <div className="flex justify-center">
                {!isAuthenticated && (
                  <WalletConnect
                    title="Connect Wallet and Claim Rewards"
                    className="gradient-ev-green text-white"
                  />
                )}
                {isAuthenticated && (
                  <Button
                    className="gradient-ev-green text-white"
                    variant="outline"
                    onClick={handleJoinChallenge}
                  >
                    Join Challenge From Leaderboard
                  </Button>
                )}
              </div>
            </div>
          )}

        {/* Single Error Message - Show when all processing is complete and both API and OCR failed */}
        {!isUploading &&
          !isFetchingDetails &&
          !isProcessingOCR &&
          uploadDetails &&
          (uploadDetails.status === "failed" ||
            uploadDetails.validationStatus === "rejected") &&
          !clientSideOCRResult && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600">
                Processing Failed
              </h2>
              <p className="text-red-600 text-sm whitespace-pre-line">
                {ocrError ||
                  uploadDetails.validationNotes ||
                  "Failed to process the image. Please ensure the image shows the odometer clearly with good lighting."}
              </p>
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Upload New Image
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

      {/* Hidden canvas for image preprocessing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        show={addVehicleModalOpen}
        onClose={() => setAddVehicleModalOpen(false)}
        handleSubmit={handleAddVehicle}
        loading={addVehicleLoading}
      />
    </div>
  );
}
