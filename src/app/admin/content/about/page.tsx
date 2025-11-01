'use client';

import { AdminLayout } from '@/components/admin/admin-layout';
import { CRUDTable } from '@/components/admin/crud-table';

export default function AboutAdmin() {
  return (
    <AdminLayout>
      <div className="p-6">
        <CRUDTable
          title="About Us Content"
          description="Manage about us page content sections"
          apiEndpoint="/api/admin/about"
          fields={[
            { name: 'titleNl', label: 'Title (NL)', type: 'text', required: true },
            { name: 'titleEn', label: 'Title (EN)', type: 'text', required: true },
            { name: 'descriptionNl', label: 'Description (NL)', type: 'textarea', required: true },
            { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
            { 
              name: 'featuresNl', 
              label: 'Features (NL) - JSON Format', 
              type: 'textarea',
              placeholder: '[{"title":"Kwaliteitsgarantie","description":"Rigoureuze kwaliteitscontrole in elke projectfase"},{"title":"Duurzame Praktijken","description":"Milieuverantwoordelijkheid in al onze activiteiten"}]',
              help: 'Enter features as JSON array. Example: [{"title":"Feature 1","description":"Description 1"},{"title":"Feature 2","description":"Description 2"}]'
            },
            { 
              name: 'featuresEn', 
              label: 'Features (EN) - JSON Format', 
              type: 'textarea',
              placeholder: '[{"title":"Quality Assurance","description":"Rigorous quality control in every project phase"},{"title":"Sustainable Practices","description":"Environmental responsibility in all our operations"}]',
              help: 'Enter features as JSON array. Example: [{"title":"Feature 1","description":"Description 1"},{"title":"Feature 2","description":"Description 2"}]'
            },
            { name: 'image', label: 'Image URL', type: 'url' },
          ]}
          displayFields={['titleNl', 'titleEn']}
        />
      </div>
    </AdminLayout>
  );
}
