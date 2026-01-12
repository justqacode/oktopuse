import { useState } from 'react';
import { toast } from 'sonner';

interface UseCloudinaryUploadReturn {
  uploadImages: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  progress: number;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    setProgress(0);

    try {
      const urls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!);
        formData.append('folder', 'maintenance-requests');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok && data.secure_url) {
          urls.push(data.secure_url);
          setProgress(((i + 1) / files.length) * 100);
        } else {
          console.error('Upload failed:', data);
          toast.error('Image upload failed');
        }
      }

      // toast.success('All images uploaded successfully');
      return urls;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Error uploading image(s)');
      return [];
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadImages, isUploading, progress };
}
