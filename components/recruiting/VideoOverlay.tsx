import React from 'react';
import { Button } from '../ui/button';
import { Video, X, ArrowLeft } from 'lucide-react';

interface VideoOverlayProps {
  videoUrl: string;
  onClose: () => void;
}

export function VideoOverlay({ videoUrl, onClose }: VideoOverlayProps) {
  // Extract video ID from Google Drive share link
  const getEmbedUrl = (url: string) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-psyduck-primary" />
            <h3 className="font-semibold">Video Resume</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="autoplay"
              title="Video Resume"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}