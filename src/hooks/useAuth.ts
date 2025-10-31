import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  email: string;
  username: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/admin/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
