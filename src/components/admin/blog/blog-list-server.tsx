import Link from 'next/link';
import { db } from '@/lib/db';
import { blogArticles } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

export async function BlogListServer() {
  // Fetch all articles from database
  const articles = await db
    .select()
    .from(blogArticles)
    .orderBy(desc(blogArticles.createdAt));

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Articles ({articles.length})</CardTitle>
        <Link href="/admin/content/blog/new">
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Title (NL)</TableHead>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No articles found. Create your first article!
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        {article.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                        {article.isPublished ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium max-w-xs truncate">
                        {article.titleNl || '-'}
                      </div>
                      {article.categoryNl && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {article.categoryNl}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {article.titleEn || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {article.categoryNl || article.categoryEn || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{article.viewCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(article.publishedAt || article.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {article.isPublished && article.slugNl && (
                          <Link 
                            href={`/blog/${article.slugNl}`}
                            target="_blank"
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/content/blog/edit/${article.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <form action={`/api/admin/blog?id=${article.id}`} method="DELETE">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            type="submit"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {articles.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Published: {articles.filter(a => a.isPublished).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Draft: {articles.filter(a => !a.isPublished).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>Featured: {articles.filter(a => a.isFeatured).length}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
