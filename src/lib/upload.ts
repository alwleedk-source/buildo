import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadOptions {
  file: File;
  directory?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export async function uploadFile(options: UploadOptions) {
  const {
    file,
    directory = 'uploads',
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  } = options;
  
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }
  
  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum ${maxSize}`);
  }
  
  // Create upload directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', directory);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}-${randomString}.${extension}`;
  
  // Save file
  const filepath = join(uploadDir, filename);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await writeFile(filepath, buffer);
  
  // Return public URL
  const publicUrl = `/${directory}/${filename}`;
  
  return {
    success: true,
    url: publicUrl,
    filename,
    size: file.size,
    type: file.type,
  };
}

export async function uploadMultipleFiles(files: File[], options?: Omit<UploadOptions, 'file'>) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await uploadFile({ ...options, file });
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        filename: file.name,
      });
    }
  }
  
  return results;
}
