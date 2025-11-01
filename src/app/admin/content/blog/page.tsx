'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlogListSimple } from '@/components/admin/blog/blog-list-simple';
import { BlogEditor } from '@/components/admin/blog/blog-editor';

export default function BlogAdmin() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNew = () => {
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {isEditing ? (
          <BlogEditor
            articleId={editingId}
            onClose={handleClose}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Blog Articles</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your blog posts and articles
                </p>
              </div>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </div>
            <BlogListSimple onEdit={handleEdit} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
