'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: Date | string;
  isApproved: boolean;
}

interface CommentsSectionProps {
  articleId: string;
  language?: 'nl' | 'en';
}

export function CommentsSection({ articleId, language = 'nl' }: CommentsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNl = language === 'nl';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });

  // Fetch comments
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['/api/blog/comments', articleId],
    queryFn: async () => {
      if (!articleId) return [];
      const response = await fetch(`/api/blog/comments?articleId=${articleId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      return data.comments || [];
    },
    enabled: !!articleId
  });

  // Submit comment mutation
  const submitComment = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, articleId })
      });
      if (!response.ok) throw new Error('Failed to submit comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/comments', articleId] });
      setFormData({ name: '', email: '', comment: '' });
      toast({
        title: isNl ? 'Reactie verzonden!' : 'Comment submitted!',
        description: isNl 
          ? 'Je reactie is verzonden en wacht op goedkeuring.'
          : 'Your comment has been submitted and is awaiting approval.',
      });
    },
    onError: () => {
      toast({
        title: isNl ? 'Fout' : 'Error',
        description: isNl 
          ? 'Er is een fout opgetreden bij het verzenden van je reactie.'
          : 'An error occurred while submitting your comment.',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      toast({
        title: isNl ? 'Vereiste velden' : 'Required fields',
        description: isNl 
          ? 'Vul alle velden in om een reactie te plaatsen.'
          : 'Please fill in all fields to submit a comment.',
        variant: 'destructive'
      });
      return;
    }
    submitComment.mutate(formData);
  };

  const formatDate = (date: Date | string) => {
    const locale = isNl ? 'nl-NL' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const approvedComments = comments?.filter(c => c.isApproved) || [];

  return (
    <div className="space-y-8">
      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            {isNl ? 'Reacties' : 'Comments'} ({approvedComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : approvedComments.length > 0 ? (
            <div className="space-y-6">
              {approvedComments.map((comment) => (
                <div key={comment.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{comment.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isNl 
                  ? 'Nog geen reacties. Wees de eerste om te reageren!'
                  : 'No comments yet. Be the first to comment!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isNl ? 'Plaats een reactie' : 'Leave a Comment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {isNl ? 'Naam' : 'Name'} *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isNl ? 'Jouw naam' : 'Your name'}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {isNl ? 'E-mail' : 'Email'} *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isNl ? 'jouw@email.com' : 'your@email.com'}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                {isNl ? 'Reactie' : 'Comment'} *
              </label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder={isNl ? 'Schrijf je reactie...' : 'Write your comment...'}
                rows={5}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={submitComment.isPending}
              >
                {submitComment.isPending 
                  ? (isNl ? 'Verzenden...' : 'Submitting...') 
                  : (isNl ? 'Verzenden' : 'Submit')}
              </Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            {isNl 
              ? 'Je e-mailadres wordt niet gepubliceerd. Reacties worden gemodereerd voordat ze worden getoond.'
              : 'Your email address will not be published. Comments are moderated before being displayed.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
