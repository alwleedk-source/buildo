'use client';

import { AdminLayout } from '@/components/admin/admin-layout';

export default function AboutUsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p>Admin page for about-us</p>
        {/* TODO: Add admin content */}
      </div>
    </AdminLayout>
  );
}
