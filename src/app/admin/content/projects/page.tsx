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
            { name: 'categoryNl', label: 'Category (NL)', type: 'text', required: true },
            { name: 'categoryEn', label: 'Category (EN)', type: 'text', required: true },
            { name: 'year', label: 'Year', type: 'text' },
            { name: 'status', label: 'Status', type: 'select', options: [
              { value: 'completed', label: 'Completed' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'planned', label: 'Planned' }
            ] },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'location', 'categoryNl', 'year', 'status']}
        />
      </div>
    </AdminLayout>
  );
}
