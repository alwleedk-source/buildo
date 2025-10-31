'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Eye, Download, Search, FileImage, File } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MediaFile } from '@/lib/db/schema';

interface MediaManagerProps {
  onSelectFile?: (file: MediaFile) => void;
  showSelectMode?: boolean;
}

export function MediaManager({ onSelectFile, showSelectMode = false }: MediaManagerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  // Fetch media files
  const { data: mediaFiles = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/admin/media"],
  });

  // Filter files based on search and type
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || 
                       (filterType === "images" && file.mimeType.startsWith("image/")) ||
                       (filterType === "documents" && !file.mimeType.startsWith("image/"));
    return matchesSearch && matchesType;
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setSelectedFile(null);
      toast({
        title: "Upload succesvol",
        description: "Bestand is succesvol geüpload.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload mislukt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({
        title: "Bestand verwijderd",
        description: "Het bestand is succesvol verwijderd.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon het bestand niet verwijderen.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      await uploadMutation.mutateAsync(selectedFile);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Weet je zeker dat je dit bestand wilt verwijderen?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: MediaFile) => {
    if (file.mimeType.startsWith('image/')) {
      if (file.thumbnail) {
        return (
          <img 
            src={file.thumbnail} 
            alt={file.originalName}
            className="h-8 w-8 object-cover rounded"
            onError={(e) => {
              // Fallback to icon if thumbnail fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        );
      }
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {showSelectMode ? "Selecteer Bestand" : "Nieuw Bestand Uploaden"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Bestand kiezen</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              accept="image/*,application/pdf,.doc,.docx,.txt"
              data-testid="input-file-upload"
            />
          </div>
          
          {selectedFile && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Geselecteerd: <span className="font-medium">{selectedFile.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                Grootte: {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
            data-testid="button-upload-file"
          >
            {uploading ? "Uploaden..." : "Upload Bestand"}
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Media Bibliotheek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Zoek bestanden..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-files"
                />
              </div>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                data-testid="select-file-type"
              >
                <option value="all">Alle bestanden</option>
                <option value="images">Afbeeldingen</option>
                <option value="documents">Documenten</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Bestanden laden...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="relative">
                        {getFileIcon(file)}
                        <FileImage className="h-8 w-8 text-blue-500 hidden" />
                      </div>
                      <div className="flex gap-1">
                        {file.mimeType.startsWith('image/') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`button-preview-${file.id}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{file.originalName}</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center">
                                <img
                                  src={file.url}
                                  alt={file.originalName}
                                  className="max-w-full max-h-96 object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(file.url, '_blank')}
                          data-testid={`button-download-${file.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(file.id)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-delete-${file.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate" title={file.originalName}>
                        {file.originalName}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {file.mimeType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Geüpload: {file.createdAt ? new Date(file.createdAt).toLocaleDateString('nl-NL') : 'Onbekend'}
                      </p>
                      
                      {showSelectMode && onSelectFile && (
                        <Button 
                          onClick={() => onSelectFile(file)}
                          className="w-full mt-2"
                          size="sm"
                          data-testid={`button-select-${file.id}`}
                        >
                          Selecteer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {filteredFiles.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Geen bestanden gevonden</p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Zoekopdracht wissen
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}