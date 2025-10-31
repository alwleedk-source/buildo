'use client';

import { AdminLayout } from '@/components/admin/admin-layout';

export default function DashboardAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Admin page for dashboard</p>
        {/* TODO: Add admin content */}
      </div>
    </AdminLayout>
  );
}
