'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function BlogAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Blog Articles"
          description="Manage blog articles and posts"
          apiEndpoint="/api/admin/blog"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'slug', label: 'URL Slug', type: 'text', required: true },
            { name: 'excerptNl', label: 'Excerpt (NL)', type: 'textarea', required: true },
            { name: 'excerptEn', label: 'Excerpt (EN)', type: 'textarea', required: true },
            { name: 'contentNl', label: 'Content (NL)', type: 'textarea', required: true },
            { name: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
            { name: 'image', label: 'Featured Image URL', type: 'url' },
            { name: 'author', label: 'Author', type: 'text' },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'tags', label: 'Tags (comma separated)', type: 'text' },
            { name: 'publishedAt', label: 'Published Date', type: 'date' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'category', 'author', 'publishedAt']}
        />
      </div>
    </AdminLayout>
  );
}
