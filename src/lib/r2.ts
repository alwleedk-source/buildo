import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Upload file to R2
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/webp'
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME!;
  const publicBaseUrl = process.env.R2_PUBLIC_URL!;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await r2Client.send(command);

    // Return public URL using R2_PUBLIC_URL environment variable
    const publicUrl = `${publicBaseUrl}/${filename}`;

    return publicUrl;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error('Failed to upload to R2');
  }
}

// Delete file from R2
export async function deleteFromR2(filename: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME!;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 delete error:', error);
    throw new Error('Failed to delete from R2');
  }
}

// Generate unique filename
export function generateFilename(originalName: string, extension: string = 'webp'): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const sanitizedName = originalName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
  
  const nameWithoutExt = sanitizedName.substring(0, sanitizedName.lastIndexOf('.')) || sanitizedName;
  
  return `blog/${nameWithoutExt}-${timestamp}-${randomString}.${extension}`;
}
