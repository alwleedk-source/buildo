import { AdminLayout } from '@/components/admin/admin-layout';
import { ThemeSettingsEditor } from '@/components/admin/theme-settings-editor';

export default function ThemeSettingsPage() {
  return (
    <AdminLayout>
      <ThemeSettingsEditor />
    </AdminLayout>
  );
}
