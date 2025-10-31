'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function MediaAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Media Library"
          description="Manage images, videos, and other media files"
          apiEndpoint="/api/admin/media"
          fields={[
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'url', label: 'File URL', type: 'url', required: true },
            { name: 'type', label: 'Media Type', type: 'select', options: ['image', 'video', 'document', 'other'], required: true },
            { name: 'alt', label: 'Alt Text', type: 'text' },
            { name: 'caption', label: 'Caption', type: 'textarea' },
            { name: 'size', label: 'File Size (KB)', type: 'number' },
            { name: 'uploadedAt', label: 'Uploaded At', type: 'date' },
          ]}
          displayFields={['title', 'type', 'size', 'uploadedAt']}
        />
      </div>
    </AdminLayout>
  );
}
