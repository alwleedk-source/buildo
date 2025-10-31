'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function AboutUsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="About Us Page Settings"
          description="Manage about us page sections and content"
          apiEndpoint="/api/admin/pages/about"
          fields={[
            { name: 'sectionName', label: 'Section Name', type: 'text', required: true },
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'contentNl', label: 'Content (NL)', type: 'textarea', required: true },
            { name: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
            { name: 'image', label: 'Section Image', type: 'url' },
            { name: 'visible', label: 'Visible', type: 'checkbox' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['sectionName', 'titleNl', 'visible', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
