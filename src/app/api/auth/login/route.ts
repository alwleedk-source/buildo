import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { comparePassword, generateToken } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@buildit-professional.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simple admin authentication
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = { id: 1, email: ADMIN_EMAIL };
      const token = generateToken(user);

      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ user });
    }

    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
