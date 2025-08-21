import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Upload, FileText, Camera, Video, CheckCircle, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { RecruitingFormData } from './types';
import { toast } from 'sonner';

interface FileUploadsSectionProps {
  formData: RecruitingFormData;
  setFormData: (updater: (prev: RecruitingFormData) => RecruitingFormData) => void;
  errors: Record<string, string>;
  handleFileUpload: (type: 'resumeFile' | 'photoFile', file: File | null) => void;
  previewVideo: () => void;
}

export function FileUploadsSection({ 
  formData, 
  setFormData, 
  errors, 
  handleFileUpload, 
  previewVideo 
}: FileUploadsSectionProps) {
  const validateAndHandleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file for your resume');
        event.target.value = ''; // Clear the input
        return;
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Resume file size must be less than 10MB');
        event.target.value = ''; // Clear the input
        return;
      }
      toast.success('Resume uploaded successfully');
    }
    handleFileUpload('resumeFile', file);
  };

  const validateAndHandlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file for your photo');
        event.target.value = ''; // Clear the input
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo file size must be less than 5MB');
        event.target.value = ''; // Clear the input
        return;
      }
      toast.success('Photo uploaded successfully');
    }
    handleFileUpload('photoFile', file);
  };

  const validateVideoUrl = (url: string) => {
    if (!url.trim()) return false;
    
    const videoUrlPatterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /drive\.google\.com/,
      /vimeo\.com/,
      /loom\.com/,
      /dropbox\.com/
    ];
    
    return videoUrlPatterns.some(pattern => pattern.test(url));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium flex items-center gap-2">
          <Upload className="h-4 w-4 text-psyduck-primary" />
          Documents & Media
        </Label>
        <p className="text-sm text-muted-foreground">Upload your resume, photo, and provide video resume link</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Upload *
            {formData.resumeFile && <CheckCircle className="h-4 w-4 text-psyduck-success" />}
          </Label>
          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            formData.resumeFile 
              ? 'border-psyduck-success bg-psyduck-success/5' 
              : errors.resumeFile 
                ? 'border-destructive bg-destructive/5' 
                : 'border-border hover:border-psyduck-primary'
          }`}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={validateAndHandleResumeUpload}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              {formData.resumeFile ? (
                <CheckCircle className="h-8 w-8 text-psyduck-success mx-auto mb-2" />
              ) : (
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">
                {formData.resumeFile ? formData.resumeFile.name : 'Click to upload resume'}
              </p>
              {formData.resumeFile ? (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(formData.resumeFile.size)} • Click to change
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
              )}
            </label>
          </div>
          {errors.resumeFile && <p className="text-sm text-destructive">{errors.resumeFile}</p>}
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Profile Photo *
            {formData.photoFile && <CheckCircle className="h-4 w-4 text-psyduck-success" />}
          </Label>
          <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            formData.photoFile 
              ? 'border-psyduck-success bg-psyduck-success/5' 
              : errors.photoFile 
                ? 'border-destructive bg-destructive/5' 
                : 'border-border hover:border-psyduck-primary'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={validateAndHandlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              {formData.photoFile ? (
                <div className="space-y-2">
                  <ImageWithFallback
                    src={URL.createObjectURL(formData.photoFile)}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-psyduck-success"
                  />
                  <p className="text-sm font-medium">{formData.photoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(formData.photoFile.size)} • Click to change
                  </p>
                </div>
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to upload photo</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </>
              )}
            </label>
          </div>
          {errors.photoFile && <p className="text-sm text-destructive">{errors.photoFile}</p>}
        </div>
      </div>

      {/* Video Resume Link */}
      <div className="space-y-2">
        <Label htmlFor="videoLink" className="flex items-center gap-2">
          <Video className="h-4 w-4 text-psyduck-primary" />
          Video Resume Link *
          {formData.videoDriveLink.trim() && validateVideoUrl(formData.videoDriveLink) && (
            <CheckCircle className="h-4 w-4 text-psyduck-success" />
          )}
        </Label>
        <div className="flex gap-2">
          <Input
            id="videoLink"
            value={formData.videoDriveLink}
            onChange={(e) => setFormData(prev => ({ ...prev, videoDriveLink: e.target.value }))}
            placeholder="https://drive.google.com/... or YouTube link"
            className={`flex-1 ${errors.videoDriveLink ? 'border-destructive' : 
              formData.videoDriveLink.trim() && validateVideoUrl(formData.videoDriveLink) ? 'border-psyduck-success' : ''}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={previewVideo}
            disabled={!formData.videoDriveLink.trim() || !validateVideoUrl(formData.videoDriveLink)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload your video resume to Google Drive, YouTube, Vimeo, or Loom and paste the link here (1-3 minutes)
        </p>
        {errors.videoDriveLink && <p className="text-sm text-destructive">{errors.videoDriveLink}</p>}
      </div>
    </div>
  );
}