"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X, PenSquare } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { PostLimitBanner } from './PostLimitBanner';
import api from '@/lib/api';
import { toast } from 'sonner';

export function CreatePostModal({ onPostCreated }: { onPostCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { friends, loading } = useFriends();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('content', content);
      files.forEach(f => formData.append('files', f));

      await api.post('/social/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast('Post published successfully');
      setOpen(false);
      setContent('');
      setFiles([]);
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish post');
    } finally {
      setUploading(false);
    }
  };

  const friendCount = friends.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-muted/50 hover:bg-muted/80 text-muted-foreground h-12 px-4 py-2 w-full">
          <PenSquare className="mr-2 h-4 w-4" />
          Share what's on your mind...
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share photos, videos, and thoughts with the community.
          </DialogDescription>
        </DialogHeader>

        <PostLimitBanner />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What do you want to talk about?"
            className="min-h-[120px] resize-none border-none focus-visible:ring-0 p-0 text-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={friendCount === 0 || uploading}
          />

          {files.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {files.map((file, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {file.type.startsWith('video') ? (
                    <span className="text-xs text-muted-foreground p-1 text-center truncate w-full">Video</span>
                  ) : (
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="upload preview" />
                  )}
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1" disabled={uploading}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={friendCount === 0 || uploading}
              />
              <label htmlFor="media-upload" className="cursor-pointer text-primary hover:bg-primary/10 p-2 rounded-full inline-flex items-center justify-center transition-colors">
                <ImagePlus className="w-5 h-5" />
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={friendCount === 0 || uploading || (!content.trim() && files.length === 0)}
              className="px-8"
            >
              {uploading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
