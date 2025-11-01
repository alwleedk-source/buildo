import { AdminLayout } from '@/components/admin/admin-layout';
import { BlogListServer } from '@/components/admin/blog/blog-list-server';

export const dynamic = 'force-dynamic';

export default function AdminBlogPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <BlogListServer />
      </div>
    </AdminLayout>
  );
}
