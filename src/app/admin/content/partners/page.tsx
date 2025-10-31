'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function PartnersAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Partners"
          description="Manage partner companies and logos"
          apiEndpoint="/api/admin/partners"
          fields={[
            { name: 'name', label: 'Partner Name', type: 'text', required: true },
            { name: 'logo', label: 'Logo URL', type: 'url', required: true },
            { name: 'website', label: 'Website URL', type: 'url' },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea' },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['name', 'website', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
