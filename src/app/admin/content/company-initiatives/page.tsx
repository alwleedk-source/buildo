'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function CompanyInitiativesAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Company Initiatives"
          description="Manage company social responsibility initiatives"
          apiEndpoint="/api/admin/company-initiatives"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea', required: true },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'link', label: 'External Link', type: 'url' },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'category', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
