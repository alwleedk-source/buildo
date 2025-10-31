'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function StatisticsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Statistics"
          description="Manage your company statistics"
          apiEndpoint="/api/admin/statistics"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'icon', label: 'Icon Name', type: 'text' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['titleNl', 'value', 'order']}
        />
      </div>
    </AdminLayout>
  );
}
