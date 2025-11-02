'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MessageSquare, Calendar, User, Mail, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BlogComment {
  id: string;
  articleId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogArticle {
  id: string;
  title: string;
}

// CommentsList component - moved outside to avoid creating during render
const CommentsList = ({ comments, emptyMessage, CommentCard }: { 
  comments: BlogComment[]; 
  emptyMessage: string;
  CommentCard: React.ComponentType<{ comment: BlogComment }>;
}) => (
  <div className="space-y-4">
    {comments.length === 0 ? (
      <p className="text-muted-foreground text-center py-8" data-testid="no-comments">
        {emptyMessage}
      </p>
    ) : (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    )}
  </div>
);

export function CommentsManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");

  // Fetch all comments
  const { data: allComments = [] } = useQuery<BlogComment[]>({
    queryKey: ["/api/admin/comments"],
  });

  // Fetch blog articles for reference
  const { data: articles = [] } = useQuery<BlogArticle[]>({
    queryKey: ["/api/admin/blog"],
  });

  // Get article title by ID
  const getArticleTitle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    return article?.title || t('comments.unknownArticle', 'Unknown Article');
  };

  // Filter comments by status
  const pendingComments = allComments.filter(c => c.status === 'pending');
  const approvedComments = allComments.filter(c => c.status === 'approved');
  const rejectedComments = allComments.filter(c => c.status === 'rejected');
  const spamComments = allComments.filter(c => c.status === 'spam');

  // Update comment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest(`/api/admin/comments/${id}`, "PUT", { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      toast({ title: t('admin.saved'), description: t('comments.statusUpdated') });
    },
    onError: () => {
      toast({ 
        title: t('admin.error', 'Error'), 
        description: t('comments.updateError', 'Failed to update comment status'), 
        variant: "destructive" 
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/comments/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      toast({ title: t('admin.saved'), description: t('comments.deleted') });
    },
    onError: () => {
      toast({ 
        title: t('admin.error', 'Error'), 
        description: t('comments.deleteError', 'Failed to delete comment'), 
        variant: "destructive" 
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      spam: "outline"
    } as const;
    
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      spam: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]} data-testid={`badge-status-${status}`}>
        {t(`comments.status.${status}`, status)}
      </Badge>
    );
  };

  const CommentCard = ({ comment }: { comment: BlogComment }) => (
    <Card key={comment.id} data-testid={`comment-card-${comment.id}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with author info and status */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold" data-testid={`text-author-${comment.id}`}>
                  {comment.authorName}
                </span>
                {getStatusBadge(comment.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span data-testid={`text-email-${comment.id}`}>{comment.authorEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span data-testid={`text-date-${comment.id}`}>
                  {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {comment.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => updateStatusMutation.mutate({ id: comment.id, status: 'approved' })}
                    disabled={updateStatusMutation.isPending}
                    data-testid={`button-approve-${comment.id}`}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t('comments.approve', 'Approve')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate({ id: comment.id, status: 'rejected' })}
                    disabled={updateStatusMutation.isPending}
                    data-testid={`button-reject-${comment.id}`}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('comments.reject', 'Reject')}
                  </Button>
                </>
              )}
              <Select
                value={comment.status}
                onValueChange={(value) => updateStatusMutation.mutate({ id: comment.id, status: value })}
                disabled={updateStatusMutation.isPending}
              >
                <SelectTrigger className="w-32" data-testid={`select-status-${comment.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending" data-testid={`option-pending-${comment.id}`}>
                    {t('comments.status.pending', 'Pending')}
                  </SelectItem>
                  <SelectItem value="approved" data-testid={`option-approved-${comment.id}`}>
                    {t('comments.status.approved', 'Approved')}
                  </SelectItem>
                  <SelectItem value="rejected" data-testid={`option-rejected-${comment.id}`}>
                    {t('comments.status.rejected', 'Rejected')}
                  </SelectItem>
                  <SelectItem value="spam" data-testid={`option-spam-${comment.id}`}>
                    {t('comments.status.spam', 'Spam')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-trigger-${comment.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('comments.deleteConfirm', 'Delete Comment')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('comments.deleteConfirmDesc', 'Are you sure you want to delete this comment? This action cannot be undone.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid={`button-cancel-delete-${comment.id}`}>
                      {t('admin.cancel', 'Cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteCommentMutation.mutate(comment.id)}
                      className="bg-destructive hover:bg-destructive/90"
                      data-testid={`button-confirm-delete-${comment.id}`}
                    >
                      {t('admin.delete', 'Delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Article reference */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded p-2">
            <MessageSquare className="w-4 h-4" />
            <span data-testid={`text-article-${comment.id}`}>
              {t('comments.onArticle', 'Comment on')}: {getArticleTitle(comment.articleId)}
            </span>
          </div>

          {/* Comment content */}
          <div className="bg-muted/30 rounded p-3">
            <p className="text-sm whitespace-pre-wrap" data-testid={`text-content-${comment.id}`}>
              {comment.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // CommentsList moved outside component

  return (
    <div className="space-y-6" data-testid="comments-manager">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" data-testid="title-comments">
            {t('comments.management', 'Comment Management')}
          </h2>
          <p className="text-muted-foreground">
            {t('comments.managementDesc', 'Moderate and manage blog comments')}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span data-testid="count-pending">{pendingComments.length} {t('comments.status.pending', 'pending')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span data-testid="count-approved">{approvedComments.length} {t('comments.status.approved', 'approved')}</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} data-testid="tabs-comments">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" data-testid="tab-pending">
            {t('comments.status.pending', 'Pending')} ({pendingComments.length})
          </TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved">
            {t('comments.status.approved', 'Approved')} ({approvedComments.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" data-testid="tab-rejected">
            {t('comments.status.rejected', 'Rejected')} ({rejectedComments.length})
          </TabsTrigger>
          <TabsTrigger value="spam" data-testid="tab-spam">
            {t('comments.status.spam', 'Spam')} ({spamComments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" data-testid="content-pending">
          <CommentsList 
            comments={pendingComments} 
            emptyMessage={t('comments.noPending', 'No pending comments')}
            CommentCard={CommentCard}
          />
        </TabsContent>

        <TabsContent value="approved" data-testid="content-approved">
          <CommentsList 
            comments={approvedComments} 
            emptyMessage={t('comments.noApproved', 'No approved comments')}
            CommentCard={CommentCard}
          />
        </TabsContent>

        <TabsContent value="rejected" data-testid="content-rejected">
          <CommentsList 
            comments={rejectedComments} 
            emptyMessage={t('comments.noRejected', 'No rejected comments')}
            CommentCard={CommentCard}
          />
        </TabsContent>

        <TabsContent value="spam" data-testid="content-spam">
          <CommentsList 
            comments={spamComments} 
            emptyMessage={t('comments.noSpam', 'No spam comments')}
            CommentCard={CommentCard}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}