/**
 * Image Optimization Utilities
 * 
 * Provides functions for:
 * - Image compression
 * - Format conversion
 * - Responsive image generation
 * - Lazy loading support
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface ResponsiveImageSizes {
  thumbnail: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export const DEFAULT_SIZES: ResponsiveImageSizes = {
  thumbnail: 150,
  small: 320,
  medium: 640,
  large: 1024,
  xlarge: 1920
};

/**
 * Optimize a single image
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    quality = 80,
    width,
    height,
    format = 'webp',
    fit = 'cover'
  } = options;

  let pipeline = sharp(inputBuffer);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  // Convert to specified format
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, progressive: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, progressive: true });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  return pipeline.toBuffer();
}

/**
 * Generate responsive image sizes
 */
export async function generateResponsiveImages(
  inputBuffer: Buffer,
  sizes: ResponsiveImageSizes = DEFAULT_SIZES
): Promise<Record<string, Buffer>> {
  const results: Record<string, Buffer> = {};

  for (const [key, width] of Object.entries(sizes)) {
    results[key] = await optimizeImage(inputBuffer, {
      width,
      format: 'webp',
      quality: 80
    });
  }

  return results;
}

/**
 * Get image metadata
 */
export async function getImageMetadata(inputBuffer: Buffer) {
  const metadata = await sharp(inputBuffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation
  };
}

/**
 * Generate blur placeholder (LQIP - Low Quality Image Placeholder)
 */
export async function generateBlurPlaceholder(
  inputBuffer: Buffer
): Promise<string> {
  const placeholder = await sharp(inputBuffer)
    .resize(20, 20, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();

  return `data:image/webp;base64,${placeholder.toString('base64')}`;
}

/**
 * Validate image file
 */
export function isValidImageType(mimetype: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ];
  return validTypes.includes(mimetype);
}

/**
 * Get optimized image URL with query params
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 1024, 1920]
): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
}
