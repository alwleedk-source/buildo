'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function EmailsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Email Logs"
          description="View email sending history and logs"
          apiEndpoint="/api/admin/email-logs"
          fields={[
            { name: 'to', label: 'Recipient', type: 'email', required: true },
            { name: 'from', label: 'Sender', type: 'email', required: true },
            { name: 'subject', label: 'Subject', type: 'text', required: true },
            { name: 'body', label: 'Email Body', type: 'textarea' },
            { name: 'status', label: 'Status', type: 'select', options: ['sent', 'failed', 'pending'] },
            { name: 'sentAt', label: 'Sent At', type: 'date' },
            { name: 'error', label: 'Error Message', type: 'textarea' },
          ]}
          displayFields={['to', 'subject', 'status', 'sentAt']}
        />
      </div>
    </AdminLayout>
  );
}
