'use client';

import { useState, useEffect } from 'react';
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
import { Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface BlogArticle {
  id: string;
  titleNl: string;
  titleEn: string;
  slugNl: string;
  slugEn: string;
  categoryNl?: string;
  author?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
}

interface BlogListSimpleProps {
  onEdit: (id: string) => void;
}

export function BlogListSimple({ onEdit }: BlogListSimpleProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      console.log('BlogListSimple API Response:', json);
      setArticles(json.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchArticles();
    } catch (err) {
      alert('Failed to delete article');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchArticles();
    } catch (err) {
      alert('Failed to update article');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading articles...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading articles: {error}
        <br />
        <Button onClick={fetchArticles} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No articles found. Create your first article!
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {article.titleNl}
                        {article.isFeatured && (
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {article.titleEn}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{article.categoryNl || '-'}</TableCell>
                <TableCell>
                  <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                    {article.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{article.viewCount}</TableCell>
                <TableCell>
                  {formatDate(article.publishedAt || article.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {article.isPublished && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/blog/${article.slugNl}`, '_blank')}
                        title="View article"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(article.id, article.isPublished)}
                      title={article.isPublished ? 'Unpublish' : 'Publish'}
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
                      title="Edit article"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      title="Delete article"
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
