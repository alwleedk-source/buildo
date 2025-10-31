'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function BackupsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="System Backups"
          description="Manage database backups and restore points"
          apiEndpoint="/api/admin/backups"
          fields={[
            { name: 'name', label: 'Backup Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'size', label: 'Size (MB)', type: 'number' },
            { name: 'type', label: 'Backup Type', type: 'select', options: ['full', 'incremental', 'manual'] },
            { name: 'status', label: 'Status', type: 'select', options: ['completed', 'in_progress', 'failed'] },
            { name: 'createdAt', label: 'Created At', type: 'date' },
            { name: 'fileUrl', label: 'Download URL', type: 'url' },
          ]}
          displayFields={['name', 'type', 'size', 'status', 'createdAt']}
        />
      </div>
    </AdminLayout>
  );
}
