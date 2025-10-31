'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function ContactSettingsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Contact Settings"
          description="Manage contact information and settings"
          apiEndpoint="/api/admin/settings/contact"
          fields={[
            { name: 'type', label: 'Contact Type', type: 'select', options: ['phone', 'email', 'address', 'social'], required: true },
            { name: 'label', label: 'Label', type: 'text', required: true },
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'icon', label: 'Icon Name', type: 'text' },
            { name: 'visible', label: 'Visible', type: 'checkbox' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['type', 'label', 'value', 'visible']}
        />
      </div>
    </AdminLayout>
  );
}
