"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, RotateCcw, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import Image from 'next/image';

// Type definitions
interface KmMatch {
  value: number;
  originalText: string;
  confidence: number;
  patternUsed: number;
}

type VehicleType = '2wheeler' | '3wheeler' | '4wheeler';

interface VehiclePatterns {
  [key: string]: RegExp[];
}

interface VehicleRanges {
  [key: string]: { min: number; max: number };
}

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
  if (typeof window !== 'undefined') {
    const Tesseract = await import('tesseract.js');
    return Tesseract.default;
  }
  return null;
};

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
    if (vehicleType === '2wheeler') threshold = 110; // More sensitive for smaller displays
    if (vehicleType === '3wheeler') threshold = 120;
    
    const binary = gray > threshold ? 255 : 0;
    
    data[i] = binary;     // R
    data[i + 1] = binary; // G  
    data[i + 2] = binary; // B
    data[i + 3] = 255;    // A
  }

  ctx.putImageData(imageData, 0, 0);

  // Step 2: Apply morphological operations to clean up noise
  const cleanedImageData = ctx.getImageData(0, 0, width, height);
  const cleanedData = cleanedImageData.data;
  
  // Simple erosion to remove noise
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      if (data[idx] === 0) { // If current pixel is black
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
  return canvas.toDataURL('image/png');
};

// Enhanced kilometer extraction with better patterns
const extractKilometersAdvanced = (ocrText: string, vehicleType: VehicleType): KmMatch | null => {
  console.log('OCR Raw Text:', ocrText);
  
  // Clean the OCR text
  const cleanText = ocrText
    .replace(/[|]/g, '1') // Common OCR mistake: | instead of 1
    .replace(/[O]/g, '0') // O instead of 0
    .replace(/[S]/g, '5') // S instead of 5
    .replace(/[l]/g, '1') // l instead of 1
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .trim();

  console.log('Cleaned Text:', cleanText);

  // Vehicle-specific patterns - more comprehensive
  const patterns: VehiclePatterns = {
    '2wheeler': [
      // Standard patterns for 2-wheelers
      /(?:total|odo|odometer|km|kilometers?)[\s:]*(\d{3,6}(?:[,.]?\d{1,3})?)/gi,
      /(\d{4,6}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?|k)/gi,
      // Digital display patterns
      /(\d{5,6})\s*(?:\.|,)?\s*\d{1}\s*(?:km|k)?/gi,
      // Just numbers that look like odometer readings
      /\b(\d{4,6})\b/g
    ],
    '3wheeler': [
      /(?:total|odo|odometer)[\s:]*(\d{4,6}(?:[,.]?\d{1,3})?)/gi,
      /(\d{4,6}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?)/gi,
      /\b(\d{5,6})\b/g
    ],
    '4wheeler': [
      /(?:total|odometer|odo)[\s:]*(\d{4,7}(?:[,.]?\d{1,3})?)/gi,
      /(\d{5,7}(?:[,.]?\d{1,3})?)\s*(?:km|kilometers?|kms?)/gi,
      /\b(\d{5,7})\b/g
    ]
  };

  const vehiclePatterns = patterns[vehicleType] || patterns['4wheeler'];
  const matches: KmMatch[] = [];

  vehiclePatterns.forEach((pattern, patternIndex) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    
    while ((match = regex.exec(cleanText)) !== null) {
      const rawValue = match[1].replace(/[,\s]/g, '');
      const numValue = parseInt(rawValue, 10);
      
      // Vehicle-specific validation ranges
      const ranges: VehicleRanges = {
        '2wheeler': { min: 100, max: 150000 },    // 100 km to 150,000 km
        '3wheeler': { min: 500, max: 500000 },    // 500 km to 500,000 km  
        '4wheeler': { min: 1000, max: 999999 }    // 1,000 km to 999,999 km
      };
      
      const range = ranges[vehicleType] || ranges['4wheeler'];
      
      if (!isNaN(numValue) && numValue >= range.min && numValue <= range.max) {
        const confidence = calculateAdvancedConfidence(match[0], cleanText, vehicleType, patternIndex, numValue);
        
        matches.push({
          value: numValue,
          originalText: match[0],
          confidence: confidence,
          patternUsed: patternIndex
        });
        
        console.log(`Found match: ${numValue} (confidence: ${confidence}%)`);
      }
    }
  });

  // Sort by confidence and return best match
  const bestMatch = matches.sort((a, b) => b.confidence - a.confidence)[0];
  console.log('Best match:', bestMatch);
  
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
  if (vehicleType === '2wheeler' && numStr.length >= 4 && numStr.length <= 5) confidence += 15;
  if (vehicleType === '3wheeler' && numStr.length >= 4 && numStr.length <= 6) confidence += 15;
  if (vehicleType === '4wheeler' && numStr.length >= 5 && numStr.length <= 6) confidence += 15;
  
  // Boost for pattern specificity (earlier patterns are more specific)
  confidence += (3 - patternIndex) * 5;
  
  // Penalty for very high numbers that seem unrealistic
  if (numValue > 500000) confidence -= 20;
  if (numValue > 200000 && vehicleType === '2wheeler') confidence -= 30;
  
  // Boost if number appears in context
  const contextWords = fullText.toLowerCase();
  if (contextWords.includes('distance') || contextWords.includes('traveled')) confidence += 10;
  
  return Math.min(Math.max(confidence, 10), 95); // Keep between 10-95%
};

const VehicleTypes: Record<VehicleType, string> = {
  '2wheeler': 'Two Wheeler (Bike/Scooter)',
  '3wheeler': 'Three Wheeler (Auto Rickshaw)', 
  '4wheeler': 'Four Wheeler (Car)'
};

export default function OdometerOCRExtractor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>('2wheeler');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [extractedKm, setExtractedKm] = useState<KmMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tesseract, setTesseract] = useState<TesseractInstance | null>(null);
  const [processingStep, setProcessingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load Tesseract.js on component mount
  useEffect(() => {
    loadTesseract().then((tesseractInstance) => {
      if (tesseractInstance) {
        setTesseract(tesseractInstance as unknown as TesseractInstance);
      }
    });
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setSelectedImage(result);
          setOcrResult(null);
          setExtractedKm(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage || !tesseract) {
      setError('Tesseract not loaded yet. Please wait a moment and try again.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setProcessingStep('Preprocessing image...');
    
    try {
      // Step 1: Preprocess image
      const processedImage = await new Promise<string>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Get image data and preprocess
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const processedDataURL = preprocessImageForOCR(canvas, ctx, imageData, vehicleType);
          
          resolve(processedDataURL);
        };
        img.src = selectedImage;
      });

      // Step 2: Perform OCR with optimized settings
      setProcessingStep('Performing OCR...');
      
      const { data: { text } } = await tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: (m: TesseractLogger) => {
            if (m.status === 'recognizing text' && m.progress !== undefined) {
              setProcessingStep(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
          tessedit_pageseg_mode: tesseract.PSM.SPARSE_TEXT,
          tessedit_char_whitelist: '0123456789.,KMkmTotalODODistancekilometers ',
          preserve_interword_spaces: '1'
        }
      );
      
      setOcrResult(text);
      setProcessingStep('Extracting kilometers...');
      
      // Step 3: Extract kilometers
      const kmData = extractKilometersAdvanced(text, vehicleType);
      
      if (kmData && kmData.confidence > 30) {
        setExtractedKm(kmData);
        setProcessingStep('Complete!');
      } else {
        setError(`Could not reliably extract kilometers from the odometer. 
                 ${kmData ? `Best guess: ${kmData.value} km (${kmData.confidence}% confidence)` : ''}
                 Please ensure the image shows the odometer clearly with good lighting.`);
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError('Failed to process image: ' + errorMessage);
      console.error('OCR Error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setOcrResult(null);
    setExtractedKm(null);
    setError(null);
    setProcessingStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Vehicle Odometer OCR Extractor
        </h1>
        <p className="text-gray-600">
          Upload speedometer/odometer image to extract total kilometers driven
        </p>
        {!tesseract && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-yellow-800 text-sm">Loading OCR engine...</p>
          </div>
        )}
      </div>

      {/* Vehicle Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Settings className="mr-2" size={16} />
          Select Vehicle Type:
        </label>
        <select 
          value={vehicleType} 
          onChange={(e) => setVehicleType(e.target.value as VehicleType)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.entries(VehicleTypes).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src={selectedImage} 
                  alt="Uploaded odometer" 
                  width={400}
                  height={300}
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
                  unoptimized
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Upload size={20} />
                  <span>Change Image</span>
                </button>
                <button
                  onClick={resetAll}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Click to upload odometer image</p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WebP formats
              </p>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Process Button */}
      {selectedImage && tesseract && (
        <div className="mb-6 text-center">
          <button
            onClick={processImage}
            disabled={isProcessing}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{processingStep || 'Processing...'}</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Extract Kilometers</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {(ocrResult || extractedKm || error) && (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-red-700 mt-1 text-sm whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}

          {extractedKm && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Total Kilometers Extracted
                </h2>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {extractedKm.value.toLocaleString()} KM
                </div>
                <p className="text-green-700">
                  Vehicle Type: {VehicleTypes[vehicleType]}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Confidence: {extractedKm.confidence}% | 
                  Detected: &quot;{extractedKm.originalText}&quot;
                </p>
              </div>
            </div>
          )}

          {ocrResult && (
            <details className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <summary className="font-medium text-blue-800 cursor-pointer">
                View OCR Raw Text
              </summary>
              <p className="text-blue-700 font-mono text-sm bg-white p-3 rounded border mt-2">
                {ocrResult}
              </p>
            </details>
          )}
        </div>
      )}

      {/* Hidden canvas for image preprocessing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Enhanced Tips */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-800 mb-3">Tips for Better OCR Accuracy:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Image Quality:</h4>
            <ul className="space-y-1">
              <li>• Take photo in good lighting</li>
              <li>• Ensure odometer numbers are in focus</li>
              <li>• Clean the display before photographing</li>
              <li>• Avoid reflections and shadows</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Camera Position:</h4>
            <ul className="space-y-1">
              <li>• Take photo straight-on (not angled)</li>
              <li>• Fill the frame with the odometer</li>
              <li>• Keep camera steady to avoid blur</li>
              <li>• Crop to show only the odometer area</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}