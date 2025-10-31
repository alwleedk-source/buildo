'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function CommentsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Blog Comments"
          description="Manage and moderate blog post comments"
          apiEndpoint="/api/admin/comments"
          fields={[
            { name: 'author', label: 'Author Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'content', label: 'Comment', type: 'textarea', required: true },
            { name: 'blogPostId', label: 'Blog Post ID', type: 'number', required: true },
            { name: 'isApproved', label: 'Approved', type: 'checkbox' },
            { name: 'createdAt', label: 'Date', type: 'datetime', readonly: true },
          ]}
          displayFields={['author', 'content', 'isApproved', 'createdAt']}
        />
      </div>
    </AdminLayout>
  );
}
