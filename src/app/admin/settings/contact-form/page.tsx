'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function ContactFormSettingsAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="Contact Form Settings"
          description="Configure contact form fields and validation"
          apiEndpoint="/api/admin/settings/contact-form"
          fields={[
            { name: 'fieldName', label: 'Field Name', type: 'text', required: true },
            { name: 'fieldType', label: 'Field Type', type: 'select', options: ['text', 'email', 'phone', 'textarea', 'select', 'checkbox'], required: true },
            { name: 'labelNl', label: 'Label (NL)', type: 'text', required: true },
            { name: 'labelEn', label: 'Label (EN)', type: 'text', required: true },
            { name: 'placeholderNl', label: 'Placeholder (NL)', type: 'text' },
            { name: 'placeholderEn', label: 'Placeholder (EN)', type: 'text' },
            { name: 'required', label: 'Required', type: 'checkbox' },
            { name: 'visible', label: 'Visible', type: 'checkbox' },
            { name: 'order', label: 'Order', type: 'number' },
          ]}
          displayFields={['fieldName', 'fieldType', 'required', 'visible']}
        />
      </div>
    </AdminLayout>
  );
}
