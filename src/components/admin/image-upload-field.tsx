'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon, Link, ExternalLink } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  'data-testid'?: string;
  altLabel?: string;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  'data-testid-alt'?: string;
  showUrlInput?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  accept = "image/*",
  'data-testid': testId,
  altLabel,
  altValue = "",
  onAltChange,
  'data-testid-alt': altTestId,
  showUrlInput = false
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Use fetch with credentials to maintain session
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Important for session authentication
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onChange(data.url);
      toast({
        title: "Upload voltooid",
        description: "Afbeelding succesvol geüpload",
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload mislukt",
        description: "Er is een fout opgetreden bij het uploaden van de afbeelding",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ongeldig bestand",
          description: "Selecteer een geldige afbeelding",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Bestand te groot",
          description: "Afbeelding mag maximaal 10MB zijn",
          variant: "destructive",
        });
        return;
      }

      uploadMutation.mutate(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    onChange(urlInput);
    setUploadMode('upload');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showUrlInput && (
          <div className="flex gap-1">
            <Button
              type="button"
              variant={uploadMode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMode('upload')}
              data-testid={`${testId}-mode-upload`}
            >
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </Button>
            <Button
              type="button"
              variant={uploadMode === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUploadMode('url')}
              data-testid={`${testId}-mode-url`}
            >
              <Link className="w-3 h-3 mr-1" />
              URL
            </Button>
          </div>
        )}
      </div>

      {uploadMode === 'upload' && (
        <div className="space-y-3">
          {/* Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${uploadMutation.isPending ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${value ? 'border-green-300 bg-green-50' : ''}
            `}
            onClick={() => fileInputRef.current?.click()}
            data-testid={testId}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              data-testid={`${testId}-file-input`}
            />
            
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-blue-600 font-medium">Uploaden...</p>
              </div>
            ) : value ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={value}
                    alt="Preview"
                    className="max-w-32 max-h-32 rounded-lg object-cover"
                    data-testid={`${testId}-preview`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    data-testid={`${testId}-remove`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-green-600 font-medium">✓ Afbeelding geüpload</p>
                <p className="text-xs text-muted-foreground">Klik om een andere afbeelding te selecteren</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium mb-1">Klik om afbeelding te uploaden</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP tot 10MB</p>
              </div>
            )}
          </div>

          {/* Current URL Display */}
          {value && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate font-mono">{value}</span>
            </div>
          )}
        </div>
      )}

      {uploadMode === 'url' && showUrlInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={placeholder}
              data-testid={`${testId}-url-input`}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              data-testid={`${testId}-url-submit`}
            >
              Toevoegen
            </Button>
          </div>
          {urlInput && (
            <img
              src={urlInput}
              alt="URL Preview"
              className="max-w-32 max-h-32 rounded-lg object-cover"
              onError={() => {
                toast({
                  title: "Ongeldig URL",
                  description: "Kan afbeelding niet laden vanaf opgegeven URL",
                  variant: "destructive",
                });
              }}
              data-testid={`${testId}-url-preview`}
            />
          )}
        </div>
      )}

      {/* Alt Text Field */}
      {altLabel && onAltChange && (
        <div>
          <Label htmlFor={`${testId}-alt`} className="text-sm">{altLabel}</Label>
          <Input
            id={`${testId}-alt`}
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Beschrijving van de afbeelding voor toegankelijkheid"
            data-testid={altTestId}
          />
        </div>
      )}
    </div>
  );
}