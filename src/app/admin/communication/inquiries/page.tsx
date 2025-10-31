'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function ContactAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Contact Inquiries"
          description="View and manage contact form submissions"
          apiEndpoint="/api/admin/inquiries"
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'subject', label: 'Subject', type: 'text', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['new', 'read', 'replied', 'closed'] },
            { name: 'createdAt', label: 'Received At', type: 'date' },
          ]}
          displayFields={['name', 'email', 'subject', 'status', 'createdAt']}
        />
      </div>
    </AdminLayout>
  );
}
