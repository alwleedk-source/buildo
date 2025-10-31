'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function ProjectsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Projects"
          description="Manage your construction projects"
          apiEndpoint="/api/admin/projects"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea', required: true },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'location', 'category', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
