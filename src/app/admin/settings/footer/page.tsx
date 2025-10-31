'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function FooterSettingsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Footer Settings"
          description="Manage footer sections and links"
          apiEndpoint="/api/admin/settings/footer"
          fields={[
            { name: 'section', label: 'Footer Section', type: 'select', options: ['about', 'services', 'links', 'social', 'legal'], required: true },
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'contentNl', label: 'Content (NL)', type: 'textarea' },
            { name: 'contentEn', label: 'Content (EN)', type: 'textarea' },
            { name: 'link', label: 'Link URL', type: 'url' },
            { name: 'visible', label: 'Visible', type: 'checkbox' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['section', 'titleNl', 'visible', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
