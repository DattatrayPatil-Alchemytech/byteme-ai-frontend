import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  fallbackClassName?: string;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackText = 'No Image',
  fallbackClassName = ''
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Don't render anything if no src
  if (!src) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center text-muted-foreground text-xs ${fallbackClassName}`}
        style={{ width, height }}
      >
        {fallbackText}
      </div>
    );
  }

  // If there was an error, show fallback
  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center text-muted-foreground text-xs ${fallbackClassName}`}
        style={{ width, height }}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
} 