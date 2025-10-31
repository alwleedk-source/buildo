'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function MaatschappelijkeAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Maatschappelijke Initiatieven"
          description="Manage corporate social responsibility initiatives"
          apiEndpoint="/api/admin/company-initiatives"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea', required: true },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
            { name: 'imageUrl', label: 'Image URL', type: 'text' },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'order', label: 'Display Order', type: 'number' },
            { name: 'isActive', label: 'Active', type: 'checkbox' },
          ]}
          displayFields={['titleNl', 'category', 'order', 'isActive']}
        />
      </div>
    </AdminLayout>
  );
}
