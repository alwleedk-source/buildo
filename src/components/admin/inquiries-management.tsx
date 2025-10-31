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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Mail, Eye, Clock, CheckCircle } from "lucide-react";
import type { ContactInquiry } from '@/lib/db/schema';

interface InquiriesManagementProps {}

export function InquiriesManagement({}: InquiriesManagementProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery<ContactInquiry[]>({
    queryKey: ['/api/admin/inquiries'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update inquiry status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inquiries'] });
      toast({
        title: "Status Updated",
        description: "Inquiry status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Nieuw</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">In Behandeling</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Afgehandeld</Badge>;
      default:
        return <Badge variant="outline">Onbekend</Badge>;
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Onbekend';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading contact inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Aanvragen</h1>
          <p className="text-muted-foreground">
            Beheer en beantwoord contact aanvragen van klanten
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Totaal Aanvragen</p>
                <p className="text-2xl font-bold" data-testid="stat-total-inquiries">
                  {inquiries.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">In Behandeling</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-inquiries">
                  {inquiries.filter((inquiry: ContactInquiry) => 
                    inquiry.status === 'new' || inquiry.status === 'in_progress'
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Afgehandeld</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-resolved-inquiries">
                  {inquiries.filter((inquiry: ContactInquiry) => inquiry.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Aanvragen
          </CardTitle>
          <CardDescription>
            Overzicht van alle contact aanvragen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Bedrijf</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Project Type</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry: ContactInquiry) => (
                <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inquiry.status)}
                      {getStatusBadge(inquiry.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium" data-testid={`text-name-${inquiry.id}`}>
                    {inquiry.firstName} {inquiry.lastName}
                  </TableCell>
                  <TableCell data-testid={`text-company-${inquiry.id}`}>
                    {inquiry.company}
                  </TableCell>
                  <TableCell className="font-mono text-sm" data-testid={`text-email-${inquiry.id}`}>
                    {inquiry.email}
                  </TableCell>
                  <TableCell data-testid={`text-project-type-${inquiry.id}`}>
                    <Badge variant="outline">
                      {inquiry.projectType}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`text-created-date-${inquiry.id}`}>
                    {formatDate(inquiry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                            data-testid={`button-view-inquiry-${inquiry.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh]">
                          <DialogHeader>
                            <DialogTitle>Contact Aanvraag Details</DialogTitle>
                            <DialogDescription>
                              Bekijk de volledige details van de contact aanvraag
                            </DialogDescription>
                          </DialogHeader>
                          {selectedInquiry && <InquiryDetails inquiry={selectedInquiry} />}
                        </DialogContent>
                      </Dialog>
                      
                      <Select 
                        value={inquiry.status || 'new'} 
                        onValueChange={(status) => updateStatusMutation.mutate({ id: inquiry.id, status })}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-status-${inquiry.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nieuw</SelectItem>
                          <SelectItem value="in_progress">In Behandeling</SelectItem>
                          <SelectItem value="resolved">Afgehandeld</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {inquiries.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Geen contact aanvragen gevonden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface InquiryDetailsProps {
  inquiry: ContactInquiry;
}

function InquiryDetails({ inquiry }: InquiryDetailsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Onbekend';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <ScrollArea className="max-h-[60vh]">
      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Informatie</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm">Naam:</label>
              <div>{inquiry.firstName} {inquiry.lastName}</div>
            </div>
            <div>
              <label className="font-medium text-sm">Bedrijf:</label>
              <div>{inquiry.company}</div>
            </div>
            <div>
              <label className="font-medium text-sm">Email:</label>
              <div className="font-mono text-sm">{inquiry.email}</div>
            </div>
            <div>
              <label className="font-medium text-sm">Telefoon:</label>
              <div>{inquiry.phone}</div>
            </div>
            <div>
              <label className="font-medium text-sm">Project Type:</label>
              <div>
                <Badge variant="outline">{inquiry.projectType}</Badge>
              </div>
            </div>
            <div>
              <label className="font-medium text-sm">Datum:</label>
              <div>{formatDate(inquiry.createdAt)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Beschrijving</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}