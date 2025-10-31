export function isUnauthorizedError(error: any): boolean {
  return (
    error?.message === 'Unauthorized' ||
    error?.status === 401 ||
    error?.response?.status === 401
  );
}

export function handleAuthError(error: any, router: any) {
  if (isUnauthorizedError(error)) {
    router.push('/login');
  }
}
