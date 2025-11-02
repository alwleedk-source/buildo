'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  blurhash?: string;
  lazy?: boolean;
  quality?: number;
  sizes?: string;
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Automatic WebP conversion
 * - Lazy loading
 * - Blur placeholder
 * - Responsive images
 * - Error handling
 */
export function OptimizedImage({
  src,
  alt,
  blurhash,
  lazy = true,
  quality = 80,
  sizes,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur data URL if blurhash provided
  const blurDataURL = blurhash || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=';

  if (hasError) {
    return (
      <div className={cn('bg-muted flex items-center justify-center', className)}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        quality={quality}
        loading={lazy ? 'lazy' : 'eager'}
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
