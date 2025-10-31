'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function AboutAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="About Us Content"
          description="Manage about us page content sections"
          apiEndpoint="/api/admin/about"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'contentNl', label: 'Content (NL)', type: 'textarea', required: true },
            { name: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'titleEn', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
