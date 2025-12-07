"use client";

import * as React from "react";

export interface UseUploadFileProps {
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: any) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
}: UseUploadFileProps = {}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      const uploadedFile = {
        name: file.name,
        url: URL.createObjectURL(file), // Temporary URL
        size: file.size,
        type: file.type,
      };

      onUploadComplete?.([uploadedFile]);
      return uploadedFile;
    } catch (error) {
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    progress,
    uploadFile,
    uploadedFile: null as {
      name: string;
      url: string;
      size: number;
      type: string;
    } | null,
    uploadingFile: null as {
      name: string;
      url: string;
      size: number;
      type: string;
    } | null,
  };
}
