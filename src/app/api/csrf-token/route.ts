import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

/**
 * CSRF Token API
 * 
 * GET - Generate and return a new CSRF token
 */
export async function GET() {
  const token = generateCsrfToken();
  
  return NextResponse.json({
    token
  });
}
