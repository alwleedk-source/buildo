'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function ServicesAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Services"
          description="Manage your construction services"
          apiEndpoint="/api/admin/services"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea', required: true },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
            { name: 'icon', label: 'Icon Name', type: 'text' },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'titleEn', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
