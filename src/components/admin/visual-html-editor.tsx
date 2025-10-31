'use client';

import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Code, FileText, Settings, Image, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VisualHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  language?: 'nl' | 'en';
}

export function VisualHtmlEditor({
  value,
  onChange,
  placeholder = "Begin met typen...",
  height = 400,
  readOnly = false,
  language = 'nl'
}: VisualHtmlEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'html' | 'preview'>('visual');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  // Advanced toolbar modules with custom options
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        // Basic formatting
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        
        // Structure
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        
        // Content
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        
        // Cleanup
        ['clean']
      ],
      handlers: {
        'link': function() {
          const range = this.quill.getSelection();
          if (range) {
            const text = this.quill.getText(range.index, range.length);
            setLinkText(text);
            document.getElementById('link-dialog-trigger')?.click();
          }
        },
        'image': function() {
          document.getElementById('image-dialog-trigger')?.click();
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'video', 'code-block',
    'color', 'background'
  ];

  const insertLink = () => {
    if (linkUrl && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        if (linkText) {
          quill.insertText(range.index, linkText, 'link', linkUrl);
        } else {
          quill.format('link', linkUrl);
        }
      }
    }
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    if (imageUrl && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, 'image', imageUrl);
        if (imageAlt) {
          // Add alt text to the image
          const img = quill.container.querySelector('img:last-child');
          if (img) {
            img.setAttribute('alt', imageAlt);
          }
        }
      }
    }
    setImageUrl('');
    setImageAlt('');
  };

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = language === 'nl' ? 200 : 250;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getWordCount = (html: string): number => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = (html: string): number => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.length;
  };

  const stats = {
    words: getWordCount(value),
    characters: getCharCount(value),
    readingTime: calculateReadingTime(value)
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            HTML Content Editor
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span data-testid="word-count">{stats.words} woorden</span>
            <span data-testid="char-count">{stats.characters} tekens</span>
            <span data-testid="reading-time">{stats.readingTime} min lezen</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual" className="flex items-center gap-2" data-testid="tab-visual">
              <FileText className="w-4 h-4" />
              Visueel
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2" data-testid="tab-html">
              <Code className="w-4 h-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" data-testid="tab-preview">
              <Eye className="w-4 h-4" />
              Voorbeeld
            </TabsTrigger>
          </TabsList>

          {/* Visual Editor */}
          <TabsContent value="visual" className="mt-4">
            <div className="border rounded-lg">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                readOnly={readOnly}
                style={{ height: `${height}px` }}
                data-testid="visual-editor"
              />
            </div>
          </TabsContent>

          {/* HTML Source Editor */}
          <TabsContent value="html" className="mt-4">
            <div className="border rounded-lg">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="HTML broncode..."
                className="w-full p-4 min-h-[400px] font-mono text-sm border-0 resize-none focus:outline-none focus:ring-0"
                readOnly={readOnly}
                data-testid="html-editor"
              />
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="mt-4">
            <div 
              className="border rounded-lg p-6 min-h-[400px] prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
              data-testid="content-preview"
            />
          </TabsContent>
        </Tabs>

        {/* Custom Dialogs for Link and Image insertion */}
        <Dialog>
          <DialogTrigger asChild>
            <button id="link-dialog-trigger" style={{ display: 'none' }} />
          </DialogTrigger>
          <DialogContent data-testid="link-dialog">
            <DialogHeader>
              <DialogTitle>Link Toevoegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-text">Linktekst</Label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Tekst die getoond wordt"
                  data-testid="input-link-text"
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  data-testid="input-link-url"
                />
              </div>
              <Button onClick={insertLink} className="w-full" data-testid="button-insert-link">
                <Link className="w-4 h-4 mr-2" />
                Link Invoegen
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button id="image-dialog-trigger" style={{ display: 'none' }} />
          </DialogTrigger>
          <DialogContent data-testid="image-dialog">
            <DialogHeader>
              <DialogTitle>Afbeelding Toevoegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">Afbeelding URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-image-url"
                />
              </div>
              <div>
                <Label htmlFor="image-alt">Alt tekst (voor toegankelijkheid)</Label>
                <Input
                  id="image-alt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Beschrijving van de afbeelding"
                  data-testid="input-image-alt"
                />
              </div>
              <Button onClick={insertImage} className="w-full" data-testid="button-insert-image">
                <Image className="w-4 h-4 mr-2" />
                Afbeelding Invoegen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default VisualHtmlEditor;