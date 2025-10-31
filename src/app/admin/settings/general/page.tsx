'use client';

import { AdminLayout } from '@/components/admin/admin-layout';

export default function SettingsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <p>Admin page for settings</p>
        {/* TODO: Add admin content */}
      </div>
    </AdminLayout>
  );
}
