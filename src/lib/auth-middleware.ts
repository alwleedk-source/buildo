import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    
    if (!sessionId) {
      return null;
    }
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionId))
      .limit(1);
    
    if (!user || !user.isActive) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }
  
  return user;
}
