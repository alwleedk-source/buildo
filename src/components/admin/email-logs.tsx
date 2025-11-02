'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import type { EmailLog } from '@/lib/db/schema';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EmailLogsProps {}

export function EmailLogs({}: EmailLogsProps) {
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [limit, setLimit] = useState(50);
  
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/email/logs', limit],
    queryFn: async () => {
      const response = await fetch(`/api/admin/email/logs?limit=${limit}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch email logs');
      }
      
      return response.json();
    },
  });

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verzonden</Badge>;
      case 'failed':
        return <Badge variant="destructive">Mislukt</Badge>;
      case 'pending':
        return <Badge variant="secondary">In afwachting</Badge>;
      default:
        return <Badge variant="outline">Onbepaald</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Onbepaald';
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
          <p className="text-sm text-muted-foreground">E-maillogs laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">E-maillogs</h1>
          <p className="text-muted-foreground">
            Bekijk het logboek van alle e-mails verzonden vanuit het systeem
          </p>
        </div>
        <Button onClick={() => refetch()} data-testid="button-refresh-logs">
          <RefreshCw className="mr-2 h-4 w-4" />
          Vernieuwen
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Totaal berichten</p>
                <p className="text-2xl font-bold" data-testid="stat-total-emails">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Verzonden</p>
                <p className="text-2xl font-bold text-green-600" data-testid="stat-sent-emails">
                  {logs.filter((log: EmailLog) => log.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Mislukt</p>
                <p className="text-2xl font-bold text-red-600" data-testid="stat-failed-emails">
                  {logs.filter((log: EmailLog) => log.status === 'failed').length}
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
                <p className="text-sm font-medium">In afwachting</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="stat-pending-emails">
                  {logs.filter((log: EmailLog) => log.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-mail logboek
          </CardTitle>
          <CardDescription>
            Laatste {limit} e-mailberichten weergeven
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="text-sm font-medium">Aantal weergegeven records:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="ml-2 border rounded px-2 py-1"
              data-testid="select-limit"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Ontvanger</TableHead>
                <TableHead>Onderwerp</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Verzenddatum</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: EmailLog) => (
                <TableRow key={log.id} data-testid={`row-email-log-${log.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium" data-testid={`text-recipient-${log.id}`}>
                    {log.to}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" data-testid={`text-subject-${log.id}`}>
                    {log.subject}
                  </TableCell>
                  <TableCell data-testid={`text-type-${log.id}`}>
                    {log.templateId ? (
                      <Badge variant="outline">Sjabloon</Badge>
                    ) : (
                      <Badge variant="secondary">Direct</Badge>
                    )}
                  </TableCell>
                  <TableCell data-testid={`text-sent-date-${log.id}`}>
                    {formatDate(log.sentAt)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          data-testid={`button-view-log-${log.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>E-mail berichtdetails</DialogTitle>
                          <DialogDescription>
                            Bekijk details en log van e-mailbericht
                          </DialogDescription>
                        </DialogHeader>
                        {selectedLog && <EmailLogDetails log={selectedLog} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {logs.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Geen e-maillogs beschikbaar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface EmailLogDetailsProps {
  log: EmailLog;
}

function EmailLogDetails({ log }: EmailLogDetailsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Onbepaald';
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'sent':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ScrollArea className="max-h-[70vh]">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basisinformatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="font-medium text-sm">Status:</label>
                <div className={`font-semibold ${getStatusColor(log.status)}`}>
                  {log.status === 'sent' && 'Succesvol verzonden'}
                  {log.status === 'failed' && 'Verzending mislukt'}
                  {log.status === 'pending' && 'Wacht op verzending'}
                  {!log.status && 'Niet gedefinieerd'}
                </div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Afzender:</label>
                <div className="font-mono text-sm">{log.from}</div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Ontvanger:</label>
                <div className="font-mono text-sm">{log.to}</div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Bericht-ID:</label>
                <div className="font-mono text-sm">{log.messageId || 'Niet beschikbaar'}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timing en statistieken</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="font-medium text-sm">Aanmaakdatum:</label>
                <div>{formatDate(log.createdAt)}</div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Verzenddatum:</label>
                <div>{formatDate(log.sentAt)}</div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Sjabloon-ID:</label>
                <div>{log.templateId || 'Direct bericht'}</div>
              </div>
              
              <div>
                <label className="font-medium text-sm">Relatietype:</label>
                <div>{log.relatedType || 'Niet gedefinieerd'}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Berichtonderwerp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-md">
              {log.subject}
            </div>
          </CardContent>
        </Card>

        {/* Error Message (if failed) */}
        {log.status === 'failed' && log.errorMessage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Foutbericht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <pre className="whitespace-pre-wrap text-sm font-mono text-red-800">
                  {log.errorMessage}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content and Variables */}
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Berichtinhoud</TabsTrigger>
            <TabsTrigger value="variables">Variabelen</TabsTrigger>
            <TabsTrigger value="metadata">Aanvullende gegevens</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTML-inhoud</CardTitle>
              </CardHeader>
              <CardContent>
                {log.htmlContent ? (
                  <div className="border rounded-md p-4 bg-white max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: log.htmlContent }} />
                  </div>
                ) : (
                  <div className="text-muted-foreground">Geen HTML inhoud</div>
                )}
              </CardContent>
            </Card>

            {log.textContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tekstinhoud</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap">
                    {log.textContent}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="variables">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gebruikte Variabelen</CardTitle>
              </CardHeader>
              <CardContent>
                {log.variables && typeof log.variables === 'object' ? (
                  <pre className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                    {JSON.stringify(log.variables, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground">Geen variabelen</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Extra Gegevens</CardTitle>
              </CardHeader>
              <CardContent>
                {log.metadata ? (
                  <pre className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground">Geen extra gegevens</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}