'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function EmailTemplatesAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Email Templates"
          description="Manage email templates for automated communications"
          apiEndpoint="/api/admin/email/templates"
          fields={[
            { name: 'name', label: 'Template Name', type: 'text', required: true },
            { name: 'subject', label: 'Email Subject', type: 'text', required: true },
            { name: 'bodyHtml', label: 'HTML Body', type: 'textarea', required: true },
            { name: 'bodyText', label: 'Plain Text Body', type: 'textarea' },
            { name: 'variables', label: 'Available Variables', type: 'text', readonly: true },
            { name: 'isActive', label: 'Active', type: 'checkbox' },
          ]}
          displayFields={['name', 'subject', 'isActive']}
        />
      </div>
    </AdminLayout>
  );
}
