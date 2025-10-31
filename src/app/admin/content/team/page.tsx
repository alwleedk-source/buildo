'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function TeamAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Team Members"
          description="Manage your team members"
          apiEndpoint="/api/admin/team"
          fields={[
            { name: 'nameNl', label: 'Name (NL)', type: 'text', required: true },
            { name: 'nameEn', label: 'Name (EN)', type: 'text', required: true },
            { name: 'positionNl', label: 'Position (NL)', type: 'text', required: true },
            { name: 'positionEn', label: 'Position (EN)', type: 'text', required: true },
            { name: 'bioNl', label: 'Bio (NL)', type: 'textarea' },
            { name: 'bioEn', label: 'Bio (EN)', type: 'textarea' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['nameNl', 'positionNl', 'email', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
