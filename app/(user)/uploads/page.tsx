"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  CheckCircle,
  Loader2,
  Award,
  AlertCircle,
  RotateCcw,
  Eye,
} from "lucide-react";
import { Button } from "@/app/components/button";
import { Alert } from "@/app/components/alert";
import { AlertDescription } from "@/app/components/alertDescription";
import Tesseract from "tesseract.js";

// Enhanced image preprocessing with multiple techniques
function preprocessImage(
  imageDataUrl: string,
  options = { enhance: true, crop: null }
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.src = imageDataUrl;
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx?.drawImage(img, 0, 0);

      if (options.enhance && ctx) {
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Enhanced preprocessing pipeline
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Convert to grayscale using luminance formula
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          // Apply contrast enhancement
          const contrast = 1.5;
          const enhanced = Math.min(
            255,
            Math.max(0, (gray - 128) * contrast + 128)
          );

          // Apply adaptive thresholding for binarization
          const threshold = 140;
          const binary = enhanced > threshold ? 255 : 0;

          // Set pixel values
          data[i] = binary; // R
          data[i + 1] = binary; // G
          data[i + 2] = binary; // B
          // Alpha channel remains unchanged
        }

        // Put processed image data back
        ctx.putImageData(imageData, 0, 0);
      }

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      resolve(imageDataUrl); // Return original if preprocessing fails
    };
  });
}

// Enhanced text extraction with multiple pattern matching
function extractOdometerReading(text: string): {
  value: number;
  confidence: string;
  matchType: string;
} {
  console.log("Extracted text:", text);

  const cleanText = text.replace(/[^\d\s\.km]/gi, " ").trim();
  console.log("Cleaned text:", cleanText);

  // Pattern 1: Direct km/kms patterns (highest priority)
  const kmPatterns = [
    /(\d{3,})\s*(?:km|kms|kilometers?)\b/gi,
    /(?:total|odometer|distance)?\s*:?\s*(\d{3,})\s*(?:km|kms)/gi,
    /(\d{1,3}(?:[,\s]\d{3})*)\s*(?:km|kms)/gi,
  ];

  for (const pattern of kmPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      const value = parseInt(matches[0][1].replace(/[,\s]/g, ""), 10);
      if (value >= 0 && value <= 999999) {
        return { value, confidence: "high", matchType: "km_pattern" };
      }
    }
  }

  // Pattern 2: Look for largest number (fallback)
  const numberPattern = /\b(\d{3,})\b/g;
  const numbers = Array.from(text.matchAll(numberPattern))
    .map((match) => parseInt(match[1], 10))
    .filter((num) => num >= 0 && num <= 999999)
    .sort((a, b) => b - a);

  if (numbers.length > 0) {
    return {
      value: numbers[0],
      confidence: "medium",
      matchType: "largest_number",
    };
  }

  // Pattern 3: Look for any multi-digit number
  const anyNumberPattern = /\b(\d{2,})\b/g;
  const anyNumbers = Array.from(text.matchAll(anyNumberPattern))
    .map((match) => parseInt(match[1], 10))
    .filter((num) => num >= 10 && num <= 999999)
    .sort((a, b) => b - a);

  if (anyNumbers.length > 0) {
    return { value: anyNumbers[0], confidence: "low", matchType: "any_number" };
  }

  return { value: 0, confidence: "none", matchType: "no_match" };
}

// Image quality assessment
function assessImageQuality(
  imageDataUrl: string
): Promise<{ quality: string; issues: string[] }> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.src = imageDataUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const issues: string[] = [];
      let quality = "good";

      // Check image size
      if (img.width < 300 || img.height < 200) {
        issues.push("Image resolution is too low");
        quality = "poor";
      }

      // Check if image is too dark or too bright
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightness = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          pixelCount++;
        }

        const avgBrightness = brightness / pixelCount;

        if (avgBrightness < 50) {
          issues.push("Image is too dark - increase lighting");
          quality = quality === "good" ? "fair" : "poor";
        } else if (avgBrightness > 220) {
          issues.push(
            "Image is too bright or has glare - reduce lighting/glare"
          );
          quality = quality === "good" ? "fair" : "poor";
        }
      }

      resolve({ quality, issues });
    };

    img.onerror = () => {
      resolve({ quality: "poor", issues: ["Unable to process image"] });
    };
  });
}

export default function UploadsPage() {
  const [uploadState, setUploadState] = useState("initial");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState({
    milesDriven: 0,
    confidence: "none",
    matchType: "",
    rawText: "",
  });
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<{
    quality: string;
    issues: string[];
  } | null>(null);
  const [showProcessedImage, setShowProcessedImage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  function validateAndReadImage(file: File) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setOcrError(
        "Invalid image format. Only JPG, PNG, or HEIC images are allowed."
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setOcrError("Image file is too large. Maximum size allowed is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
      startAnalysis(imageData);
    };
    reader.readAsDataURL(file);
  }

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      validateAndReadImage(file);
    }
  };

  const startAnalysis = async (imageData: string) => {
    setUploadState("uploading");
    setProgress(0);
    setOcrError(null);
    setImageQuality(null);

    // Assess image quality first
    const quality = await assessImageQuality(imageData);
    setImageQuality(quality);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadState("analyzing");
          runOcr(imageData);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const runOcr = async (imageData: string) => {
    try {
      // Preprocess image for better OCR
      const processedImageData = await preprocessImage(imageData, {
        enhance: true,
        crop: null,
      });
      setProcessedImage(processedImageData);

      // Run OCR with enhanced settings
      const payload: any = {
        logger: (m: any) => console.log(m),
        tessedit_char_whitelist: "0123456789kmKM .",
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
      };
      const {
        data: { text, confidence },
      } = await Tesseract.recognize(processedImageData, "eng", payload);

      console.log("OCR Text:", text);
      console.log("OCR Confidence:", confidence);

      const extraction = extractOdometerReading(text);

      if (extraction.confidence === "none" || extraction.value === 0) {
        // If no reading found, try with original image
        const {
          data: { text: originalText },
        } = await Tesseract.recognize(imageData, "eng", {
          logger: (m) => console.log(m),
        });

        const originalExtraction = extractOdometerReading(originalText);
        if (
          originalExtraction.confidence !== "none" &&
          originalExtraction.value > 0
        ) {
          setOcrResults({
            milesDriven: originalExtraction.value,
            confidence: originalExtraction.confidence,
            matchType: originalExtraction.matchType,
            rawText: originalText,
          });
          setUploadState("completed");
          return;
        }

        throw new Error("Unable to detect odometer reading from the image");
      }

      setOcrResults({
        milesDriven: extraction.value,
        confidence: extraction.confidence,
        matchType: extraction.matchType,
        rawText: text,
      });
      setUploadState("completed");
    } catch (error) {
      console.error("OCR Error:", error);
      let errorMessage = "Failed to extract odometer reading. ";

      if (imageQuality?.quality === "poor") {
        errorMessage +=
          "Image quality issues detected: " + imageQuality.issues.join(", ");
      } else {
        errorMessage +=
          "Please try with a clearer image showing the odometer display more prominently.";
      }

      setOcrError(errorMessage);
      setUploadState("initial");
      setUploadedImage(null);
      setProcessedImage(null);
      setProgress(0);
    }
  };

  const resetUpload = () => {
    setUploadState("initial");
    setUploadedImage(null);
    setProcessedImage(null);
    setProgress(0);
    setOcrError(null);
    setImageQuality(null);
    setShowProcessedImage(false);
  };

  if (uploadState === "initial") {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {ocrError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {ocrError}
            </AlertDescription>
          </Alert>
        )}

        <div className="border border-gray-200 rounded-xl p-6 bg-white max-w-2xl w-full mx-auto mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-6 h-6 text-gray-500" />
              <span className="font-bold text-lg">Upload Odometer Photo</span>
            </div>
            <p className="text-gray-500 mb-4 text-sm">
              Take a clear photo of your EV&apos;s odometer to verify your
              mileage and earn B3TR tokens
            </p>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition hover:border-green-400"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
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
            <Button size="lg" className="gradient-ev-green text-white mt-4">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={handleFileUpload}
              accept="image/*"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 bg-white max-w-2xl w-full mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg">
              📋 Upload Tips for Best Results
            </span>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Follow these guidelines for accurate odometer reading
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Ensure the odometer digits are clearly visible and well-lit</li>
            <li>Take the photo straight-on to avoid distortion</li>
            <li>
              Make sure there&apos;s no glare or reflection on the display
            </li>
            <li>Focus on the odometer area - crop out unnecessary parts</li>
            <li>Use good lighting conditions and avoid shadows</li>
            <li>Ensure the numbers are sharp and not blurry</li>
            <li>
              Try to capture the &quot;km&quot; or &quot;KM&quot; text along
              with the numbers
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (uploadState === "uploading" || uploadState === "analyzing") {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-6 h-6 text-gray-500" />
            <span className="font-bold text-lg">Upload Odometer Photo</span>
          </div>
          <p className="text-gray-500 mb-4 text-sm">
            Processing your odometer image with AI enhancement
          </p>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 bg-white max-w-2xl w-full mx-auto mb-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Image Display */}
            <div className="flex justify-center w-full">
              <div className="relative">
                <Image
                  src={
                    showProcessedImage && processedImage
                      ? processedImage
                      : uploadedImage || "/api/placeholder/280/160"
                  }
                  alt="Uploaded odometer"
                  width={280}
                  height={160}
                  className="rounded-md max-w-xs border"
                  style={{ objectFit: "cover" }}
                />
                {processedImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => setShowProcessedImage(!showProcessedImage)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Image Quality Assessment */}
            {imageQuality && (
              <div
                className={`text-center p-3 rounded-lg ${
                  imageQuality.quality === "good"
                    ? "bg-green-50 text-green-800"
                    : imageQuality.quality === "fair"
                    ? "bg-yellow-50 text-yellow-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">
                  Image Quality: {imageQuality.quality.toUpperCase()}
                </p>
                {imageQuality.issues.length > 0 && (
                  <ul className="text-sm mt-1">
                    {imageQuality.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Progress Section */}
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <div className="text-left">
                  <p className="font-medium">
                    {uploadState === "uploading"
                      ? "Processing image..."
                      : "Extracting odometer reading..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {uploadState === "uploading"
                      ? "Enhancing image quality for better OCR"
                      : "Using AI to detect km/miles values"}
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-700 bg-green-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetUpload}
              className="text-green-700 hover:bg-green-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Upload different photo
            </Button>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            💡 Our AI is analyzing your image with advanced preprocessing to
            extract the most accurate odometer reading
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (uploadState === "completed") {
    const confidenceColor =
      ocrResults.confidence === "high"
        ? "text-green-600"
        : ocrResults.confidence === "medium"
        ? "text-yellow-600"
        : "text-red-600";

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Odometer Reading Extracted
          </h1>
          <p className="text-muted-foreground">
            Your sustainable driving has earned you B3TR tokens!
          </p>
        </div>

        {/* Results Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 text-center">
            <div className="text-4xl font-bold mb-2">
              {ocrResults.milesDriven.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Kilometers Driven
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Confidence: </span>
                <span className={`font-medium ${confidenceColor}`}>
                  {ocrResults.confidence.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Detection: </span>
                <span className="font-medium">
                  {ocrResults.matchType.replace("_", " ")}
                </span>
              </div>
            </div>

            {ocrResults.rawText && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  View extracted text
                </summary>
                <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                  {ocrResults.rawText}
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Confidence Alert */}
        {ocrResults.confidence === "low" && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Low Confidence Detection</strong>
              <br />
              The reading was extracted but with low confidence. Consider
              uploading a clearer image for more accurate results.
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {ocrResults.confidence === "high" && (
          <Alert className="border-green-200 bg-green-50">
            <Award className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Perfect Reading! 🎉</strong>
              <br />
              High confidence odometer reading detected:{" "}
              {ocrResults.milesDriven.toLocaleString()} km
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button size="lg" className="w-full gradient-ev-green text-white">
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm & Claim B3TR Tokens
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-green-600 text-green-700 hover:bg-green-50"
            onClick={resetUpload}
          >
            Upload New Reading
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
