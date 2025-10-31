'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function SettingsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="General Settings"
          description="Manage website general settings and configuration"
          apiEndpoint="/api/admin/settings"
          fields={[
            { name: 'key', label: 'Setting Key', type: 'text', required: true },
            { name: 'value', label: 'Setting Value', type: 'textarea', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['general', 'contact', 'social', 'seo', 'other'] },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'type', label: 'Value Type', type: 'select', options: ['text', 'number', 'boolean', 'json'] },
          ]}
          displayFields={['key', 'value', 'category', 'type']}
        />
      </div>
    </AdminLayout>
  );
}
