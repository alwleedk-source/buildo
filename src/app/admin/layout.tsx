'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  return <>{children}</>;
}
