'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface BlogArticle {
  id: string;
  titleNl: string;
  titleEn: string;
  categoryNl?: string;
  author?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
}

interface BlogListProps {
  onEdit: (id: string) => void;
}

export function BlogList({ onEdit }: BlogListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: BlogArticle[] }>({
    queryKey: ['/api/admin/blog'],
    queryFn: async () => {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
    },
  });

  const articles = data?.data || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No articles found. Create your first article!
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {article.titleNl}
                    {article.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{article.categoryNl || '-'}</TableCell>
                <TableCell>{article.author || '-'}</TableCell>
                <TableCell>
                  <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{article.viewCount}</TableCell>
                <TableCell>
                  {article.publishedAt
                    ? format(new Date(article.publishedAt), 'MMM d, yyyy')
                    : format(new Date(article.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate({ id: article.id, isPublished: article.isPublished })}
                    >
                      {article.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(article.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this article?')) {
                          deleteMutation.mutate(article.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
