'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Edit, Trash2, Eye, Send } from "lucide-react";
import type { EmailTemplate, InsertEmailTemplate } from '@/lib/db/schema';

const templateTypes = [
  { value: "contact_confirmation", label: "Contactbevestiging" },
  { value: "contact_reply", label: "Reactie op klantverzoek" },
  { value: "notification", label: "Beheermelding" },
  { value: "newsletter", label: "Nieuwsbrief" },
  { value: "welcome", label: "Welkomstbericht" },
  { value: "custom", label: "Aangepaste template" }
];

interface EmailTemplatesProps {}

export function EmailTemplates({}: EmailTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState<EmailTemplate | null>(null);
  const [showSendDialog, setShowSendDialog] = useState<EmailTemplate | null>(null);
  
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/admin/email/templates'],
  });

  const createMutation = useMutation({
    mutationFn: async (template: InsertEmailTemplate) => {
      const response = await fetch('/api/admin/email/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(template),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email/templates'] });
      setShowCreateDialog(false);
      toast({
        title: "Template aangemaakt",
        description: "E-mailtemplate succesvol aangemaakt",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij aanmaken template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, template }: { id: string; template: Partial<InsertEmailTemplate> }) => {
      const response = await fetch(`/api/admin/email/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(template),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update template');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email/templates'] });
      setEditingTemplate(null);
      toast({
        title: "Template bijgewerkt",
        description: "E-mailtemplate succesvol bijgewerkt",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij bijwerken template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/email/templates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/email/templates'] });
      setShowDeleteDialog(null);
      toast({
        title: "Template verwijderd",
        description: "E-mailtemplate succesvol verwijderd",
      });
    },
    onError: (error) => {
      toast({
        title: "Fout bij verwijderen template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendTestEmail = async (template: EmailTemplate, testEmail: string) => {
    try {
      const response = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          templateId: template.id,
          to: testEmail,
          variables: template.variables || {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      toast({
        title: "Test email verzonden",
        description: `Test email verzonden naar ${testEmail}`,
      });
      
      setShowSendDialog(null);
    } catch (error: any) {
      toast({
        title: "Fout bij verzenden email",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Email templates laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">
            Beheer email templates voor automatische antwoorden en notificaties
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-template">
              <Plus className="mr-2 h-4 w-4" />
              Nieuw template aanmaken
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nieuw email template aanmaken</DialogTitle>
              <DialogDescription>
                Maak een nieuw email template aan voor gebruik in het systeem
              </DialogDescription>
            </DialogHeader>
            <TemplateForm
              onSubmit={(template) => createMutation.mutate(template)}
              onCancel={() => setShowCreateDialog(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Beschikbare Email Templates
          </CardTitle>
          <CardDescription>
            {templates.length} templates beschikbaar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Naam</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Onderwerp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Laatste Update</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template: EmailTemplate) => (
                <TableRow key={template.id} data-testid={`row-template-${template.id}`}>
                  <TableCell className="font-medium" data-testid={`text-template-name-${template.id}`}>
                    {template.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" data-testid={`badge-template-type-${template.id}`}>
                      {templateTypes.find(t => t.value === template.templateType)?.label || template.templateType}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" data-testid={`text-template-subject-${template.id}`}>
                    {template.subject}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={template.isActive ? "default" : "secondary"}
                      data-testid={`badge-template-status-${template.id}`}
                    >
                      {template.isActive ? "Actief" : "Inactief"}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`text-template-updated-${template.id}`}>
                    {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString('nl-NL') : 'Niet opgegeven'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreviewDialog(template)}
                        data-testid={`button-preview-template-${template.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                        data-testid={`button-edit-template-${template.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSendDialog(template)}
                        data-testid={`button-send-template-${template.id}`}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteDialog(template.id)}
                        data-testid={`button-delete-template-${template.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email template bewerken</DialogTitle>
            <DialogDescription>
              Bewerk het email template
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <TemplateForm
              initialData={editingTemplate}
              onSubmit={(template) => updateMutation.mutate({ 
                id: editingTemplate.id, 
                template 
              })}
              onCancel={() => setEditingTemplate(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!showPreviewDialog} onOpenChange={() => setShowPreviewDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Template voorbeeld</DialogTitle>
            <DialogDescription>
              Email template voorvertoning
            </DialogDescription>
          </DialogHeader>
          {showPreviewDialog && <TemplatePreview template={showPreviewDialog} />}
        </DialogContent>
      </Dialog>

      {/* Send Test Email Dialog */}
      <Dialog open={!!showSendDialog} onOpenChange={() => setShowSendDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test email verzenden</DialogTitle>
            <DialogDescription>
              Voer een emailadres in om een test email te versturen
            </DialogDescription>
          </DialogHeader>
          {showSendDialog && <TestEmailForm 
            template={showSendDialog} 
            onSend={sendTestEmail}
            onCancel={() => setShowSendDialog(null)}
          />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Template verwijderen bevestigen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je dit template wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteDialog && deleteMutation.mutate(showDeleteDialog)}
              data-testid="button-confirm-delete"
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface TemplateFormProps {
  initialData?: EmailTemplate;
  onSubmit: (template: InsertEmailTemplate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function TemplateForm({ initialData, onSubmit, onCancel, isLoading }: TemplateFormProps) {
  const [formData, setFormData] = useState<InsertEmailTemplate>({
    name: initialData?.name || '',
    subject: initialData?.subject || '',
    templateType: initialData?.templateType || 'custom',
    htmlContent: initialData?.htmlContent || '',
    textContent: initialData?.textContent || '',
    variables: initialData?.variables || {},
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Naam</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-template-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="templateType">Template Type</Label>
          <Select 
            value={formData.templateType} 
            onValueChange={(value) => setFormData({ ...formData, templateType: value })}
          >
            <SelectTrigger data-testid="select-template-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Email Onderwerp</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          data-testid="input-template-subject"
        />
      </div>

      <Tabs defaultValue="html" className="w-full">
        <TabsList>
          <TabsTrigger value="html">HTML Inhoud</TabsTrigger>
          <TabsTrigger value="text">Tekst Inhoud</TabsTrigger>
          <TabsTrigger value="variables">Variabelen</TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="space-y-2">
          <Label htmlFor="htmlContent">HTML Inhoud</Label>
          <Textarea
            id="htmlContent"
            value={formData.htmlContent}
            onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
            rows={15}
            className="font-mono text-sm"
            required
            data-testid="textarea-html-content"
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-2">
          <Label htmlFor="textContent">Tekst Inhoud (optioneel)</Label>
          <Textarea
            id="textContent"
            value={formData.textContent || ''}
            onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
            rows={10}
            data-testid="textarea-text-content"
          />
        </TabsContent>

        <TabsContent value="variables" className="space-y-2">
          <Label>Beschikbare Variabelen</Label>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground mb-2">
              Je kunt de volgende variabelen gebruiken in het template met {'{{'} variabele_naam {'}}'}:
            </p>
            <div className="text-sm space-y-1">
              {Object.entries(formData.variables || {}).map(([key, description]) => (
                <div key={key} className="flex justify-between">
                  <code className="bg-primary/10 px-2 py-1 rounded text-xs">{`{{${key}}}`}</code>
                  <span className="text-muted-foreground">{String(description)}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          data-testid="checkbox-template-active"
        />
        <Label htmlFor="isActive">Template activeren</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="button-cancel-template"
        >
          Annuleren
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          data-testid="button-save-template"
        >
          {isLoading ? "Bezig met opslaan..." : "Template opslaan"}
        </Button>
      </div>
    </form>
  );
}

interface TemplatePreviewProps {
  template: EmailTemplate;
}

function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Email Onderwerp:</h3>
          <p className="text-sm bg-muted p-2 rounded">{template.subject}</p>
        </div>
        
        <Tabs defaultValue="html">
          <TabsList>
            <TabsTrigger value="html">HTML Voorbeeld</TabsTrigger>
            <TabsTrigger value="text">Platte Tekst</TabsTrigger>
          </TabsList>
          
          <TabsContent value="html">
            <div 
              className="border rounded-md p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: template.htmlContent }}
            />
          </TabsContent>
          
          <TabsContent value="text">
            <div className="border rounded-md p-4 bg-muted font-mono text-sm whitespace-pre-wrap">
              {template.textContent || 'Geen tekstinhoud'}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

interface TestEmailFormProps {
  template: EmailTemplate;
  onSend: (template: EmailTemplate, email: string) => void;
  onCancel: () => void;
}

function TestEmailForm({ template, onSend, onCancel }: TestEmailFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(template, email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testEmail">Email Adres</Label>
        <Input
          id="testEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test@example.com"
          required
          data-testid="input-test-email"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="button-cancel-send"
        >
          Annuleren
        </Button>
        <Button 
          type="submit"
          data-testid="button-send-test"
        >
          Test email verzenden
        </Button>
      </div>
    </form>
  );
}