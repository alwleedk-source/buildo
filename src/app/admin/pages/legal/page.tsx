'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function LegalPagesAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Legal Pages"
          description="Manage legal pages (Privacy Policy, Terms of Service, etc.)"
          apiEndpoint="/api/admin/legal-pages"
          fields={[
            { name: 'pageType', label: 'Page Type', type: 'select', required: true, options: [
              { value: 'privacy', label: 'Privacy Policy' },
              { value: 'terms', label: 'Terms of Service' },
              { value: 'cookies', label: 'Cookie Policy' },
              { value: 'disclaimer', label: 'Disclaimer' },
            ]},
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'contentNl', label: 'Content (NL)', type: 'textarea', required: true },
            { name: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
            { name: 'slugNl', label: 'URL Slug (NL)', type: 'text', required: true },
            { name: 'slugEn', label: 'URL Slug (EN)', type: 'text', required: true },
            { name: 'showInFooter', label: 'Show in Footer', type: 'checkbox' },
            { name: 'isActive', label: 'Active', type: 'checkbox' },
            { name: 'order', label: 'Display Order', type: 'number' },
          ]}
          displayFields={['pageType', 'titleNl', 'showInFooter', 'isActive']}
        />
      </div>
    </AdminLayout>
  );
}
