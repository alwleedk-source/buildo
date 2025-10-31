'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function TestimonialsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Testimonials"
          description="Manage customer testimonials"
          apiEndpoint="/api/admin/testimonials"
          fields={[
            { name: 'nameNl', label: 'Name (NL)', type: 'text', required: true },
            { name: 'nameEn', label: 'Name (EN)', type: 'text', required: true },
            { name: 'textNl', label: 'Testimonial (NL)', type: 'textarea', required: true },
            { name: 'textEn', label: 'Testimonial (EN)', type: 'textarea', required: true },
            { name: 'position', label: 'Position', type: 'text' },
            { name: 'company', label: 'Company', type: 'text' },
            { name: 'rating', label: 'Rating (1-5)', type: 'number' },
            { name: 'image', label: 'Image URL', type: 'url' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['nameNl', 'company', 'rating', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
