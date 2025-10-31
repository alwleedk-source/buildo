'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Download, 
  Trash2, 
  Clock, 
  FileText,
  Shield,
  RefreshCw,
  Filter,
  Package,
  Calendar
} from "lucide-react";
import { ContentBackup } from '@/lib/db/schema';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
// Removed Arabic locale import - using Dutch only

export function ContentBackupsManager() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBackup, setSelectedBackup] = useState<ContentBackup | null>(null);

  // Queries
  const { data: allBackups = [], isLoading } = useQuery<ContentBackup[]>({
    queryKey: ["/api/admin/content-backups"],
  });

  const { data: filteredBackups = [] } = useQuery<ContentBackup[]>({
    queryKey: ["/api/admin/content-backups/type", selectedType],
    enabled: selectedType !== "all",
  });

  const backupsToShow = selectedType !== "all" ? filteredBackups : allBackups;

  // Mutations
  const deleteBackupMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/content-backups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-backups"] });
      if (selectedType) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/content-backups/type", selectedType] });
      }
      toast({ title: "Gelukt!", description: "Backup succesvol verwijderd" });
    },
    onError: () => {
      toast({ title: "Fout", description: "Verwijderen van backup mislukt", variant: "destructive" });
    },
  });

  const restoreBackupMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/content-backups/restore/${id}`);
    },
    onSuccess: () => {
      // Invalidate all content caches so UI reflects the restored content
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-backups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/maatschappelijke"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/company-details"] });
      queryClient.invalidateQueries({ queryKey: ["/api/footer-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/section-settings"] });
      toast({ title: "Gelukt!", description: "Inhoud succesvol hersteld vanuit backup" });
    },
    onError: () => {
      toast({ title: "Fout", description: "Herstel van inhoud mislukt", variant: "destructive" });
    },
  });

  const cleanupBackupsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/content-backups/cleanup");
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content-backups"] });
      toast({ 
        title: "Gelukt!", 
        description: `${result.deletedCount} verlopen backups verwijderd` 
      });
    },
    onError: () => {
      toast({ title: "Fout", description: "Opschonen van backups mislukt", variant: "destructive" });
    },
  });

  const getBackupTypeLabel = (type: string | null | undefined) => {
    if (!type) return "Niet opgegeven";
    const types: Record<string, string> = {
      hero: "Hero Sectie",
      statistics: "Statistieken",
      services: "Diensten", 
      projects: "Projecten",
      blog: "Blog",
      partners: "Partners",
      maatschappelijke: "Maatschappelijke Verantwoordelijkheid",
      about: "Over Ons",
      "company-details": "Bedrijfsgegevens"
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive"
    };
    
    const labels: Record<string, string> = {
      completed: "Voltooid",
      pending: "In behandeling",
      failed: "Mislukt"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getBackupTypeOptions = () => {
    const types = Array.from(new Set(allBackups.map(b => b.contentType).filter(Boolean)));
    return types.map(type => ({
      value: type || 'unknown',
      label: getBackupTypeLabel(type)
    }));
  };

  if (isLoading) {
    return <div data-testid="loading">Aan het laden...</div>;
  }

  return (
    <div className="space-y-6" data-testid="content-backups-manager">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Contentback-ups beheren
          </CardTitle>
          <CardDescription>
            Bekijk en beheer automatische back-ups voor alle contenttypen
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48" data-testid="select-backup-type">
                    <SelectValue placeholder="Alle types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle types</SelectItem>
                    {getBackupTypeOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => cleanupBackupsMutation.mutate()}
                disabled={cleanupBackupsMutation.isPending}
                data-testid="button-cleanup-backups"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Verlopen backups opschonen
              </Button>
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Totaal backups</p>
                    <p className="text-2xl font-bold">{allBackups.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Voltooid</p>
                    <p className="text-2xl font-bold">
                      {allBackups.filter(b => b.status === "completed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">In behandeling</p>
                    <p className="text-2xl font-bold">
                      {allBackups.filter(b => b.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Laatste backup</p>
                    <p className="text-sm font-medium">
                      {allBackups.length > 0 && allBackups[0].createdAt
                        ? format(new Date(allBackups[0].createdAt), "dd/MM/yyyy")
                        : "Geen"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Backups List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Backups {selectedType !== "all" && `- ${getBackupTypeLabel(selectedType)}`}
            </h3>

            {backupsToShow.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {selectedType !== "all"
                      ? `Geen backups voor type ${getBackupTypeLabel(selectedType)}`
                      : "Geen backups"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {backupsToShow.map((backup) => (
                  <Card key={backup.id} data-testid={`backup-item-${backup.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">
                              {backup.contentType ? getBackupTypeLabel(backup.contentType) : "Type niet opgegeven"}
                            </span>
                            {getStatusBadge(backup.status || "pending")}
                            <Badge variant="outline">
                              Versie {backup.version || 1}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {backup.description || "Automatische backup"}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Aangemaakt: {backup.createdAt ? format(new Date(backup.createdAt), "dd/MM/yyyy HH:mm") : "Onbekend"}
                            </span>
                            {backup.completedAt && (
                              <span>
                                Voltooid: {format(new Date(backup.completedAt), "dd/MM/yyyy HH:mm")}
                              </span>
                            )}
                            {backup.expiresAt && (
                              <span>
                                Verloopt: {format(new Date(backup.expiresAt), "dd/MM/yyyy")}
                              </span>
                            )}
                            {backup.recordCount && (
                              <span>
                                Records: {backup.recordCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {backup.status === "completed" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid={`button-restore-${backup.id}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Inhoud herstellen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Weet je zeker dat je de inhoud wilt herstellen vanuit deze backup? 
                                    De huidige inhoud wordt vervangen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => restoreBackupMutation.mutate(backup.id)}
                                    disabled={restoreBackupMutation.isPending}
                                  >
                                    Herstellen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                data-testid={`button-delete-${backup.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Backup verwijderen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je deze backup wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteBackupMutation.mutate(backup.id)}
                                  disabled={deleteBackupMutation.isPending}
                                >
                                  Verwijderen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}