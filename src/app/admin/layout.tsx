'use client';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Re-enable authentication later
  // For now, allow direct access for testing
  
  return <>{children}</>;
}
