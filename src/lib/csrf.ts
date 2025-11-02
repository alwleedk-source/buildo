/**
 * CSRF Protection Utilities
 * 
 * Protects against Cross-Site Request Forgery attacks
 */

import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const TOKEN_LENGTH = 32;

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(TOKEN_LENGTH).toString('hex');
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${timestamp}`)
    .digest('hex');
  
  return `${token}:${timestamp}:${signature}`;
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string, maxAgeSeconds: number = 3600): boolean {
  try {
    const [tokenPart, timestampPart, signaturePart] = token.split(':');
    
    if (!tokenPart || !timestampPart || !signaturePart) {
      return false;
    }

    // Verify signature
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(`${tokenPart}:${timestampPart}`)
      .digest('hex');
    
    if (signaturePart !== expectedSignature) {
      return false;
    }

    // Check token age
    const timestamp = parseInt(timestampPart);
    const age = (Date.now() - timestamp) / 1000;
    
    if (age > maxAgeSeconds) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * CSRF middleware for API routes
 */
export function csrfProtection(request: Request): { valid: boolean; error?: string } {
  // Skip CSRF check for GET, HEAD, OPTIONS
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  // Get token from header
  const token = request.headers.get('x-csrf-token');
  
  if (!token) {
    return {
      valid: false,
      error: 'CSRF token missing'
    };
  }

  if (!verifyCsrfToken(token)) {
    return {
      valid: false,
      error: 'Invalid or expired CSRF token'
    };
  }

  return { valid: true };
}

/**
 * Create CSRF error response
 */
export function createCsrfErrorResponse(error: string = 'CSRF validation failed') {
  return new Response(
    JSON.stringify({
      error: 'Forbidden',
      message: error
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
