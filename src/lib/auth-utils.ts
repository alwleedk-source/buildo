import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  const [user] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true
    })
    .returning();
  
  return user;
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }
  
  return user;
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function createPasswordResetToken(email: string) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
  
  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpiry
    })
    .where(eq(users.email, email));
  
  return resetToken;
}

export async function resetPassword(token: string, newPassword: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.resetToken, token))
    .limit(1);
  
  if (!user) {
    throw new Error('Invalid reset token');
  }
  
  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error('Reset token has expired');
  }
  
  const hashedPassword = await hashPassword(newPassword);
  
  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    })
    .where(eq(users.id, user.id));
  
  return true;
}
