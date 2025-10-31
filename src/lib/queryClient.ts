import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Overloaded function signatures for backward compatibility
export async function apiRequest<T = any>(
  url: string,
  method: string,
  body?: any
): Promise<T>;
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T>;
export async function apiRequest<T = any>(
  url: string,
  methodOrOptions?: string | RequestInit,
  body?: any
): Promise<T> {
  let options: RequestInit;

  // Handle old signature: apiRequest(url, method, body)
  if (typeof methodOrOptions === 'string') {
    options = {
      method: methodOrOptions,
      headers: {
        ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
      },
      body: body instanceof FormData ? body : JSON.stringify(body),
    };
  } else {
    // Handle new signature: apiRequest(url, options)
    options = {
      ...methodOrOptions,
      headers: {
        'Content-Type': 'application/json',
        ...methodOrOptions?.headers,
      },
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
