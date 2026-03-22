'use client';

import { useState } from 'react';
import Image from 'next/image';
import { upload } from '@imagekit/next';
import { Loader2, Upload, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui/button';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticator = async () => {
    const response = await fetch('/api/upload-auth');
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    return response.json();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const authParams = await authenticator();

      // Проверяем, что все необходимые поля есть
      if (
        !authParams.signature ||
        !authParams.token ||
        !authParams.expire ||
        !authParams.publicKey
      ) {
        throw new Error('Invalid authentication parameters');
      }

      const response = await upload({
        signature: authParams.signature,
        token: authParams.token,
        expire: authParams.expire,
        publicKey: authParams.publicKey,
        file,
        fileName: file.name,
        folder: '/article-covers',
        useUniqueFileName: true,
      });
      console.log('img:', response);
      onChange(response.url ? `${response.url}?id=${response.fileId}` : '');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image src={value} alt="Cover" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={disabled || isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
              <p className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload cover image'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
