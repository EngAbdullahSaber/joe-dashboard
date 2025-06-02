"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";
import { baseUrl } from "@/services/app.config";
import { useEffect, useState } from "react";

interface MultiImageUploaderProps {
  files: (File | string)[] | null;
  setFiles: (files: File[] | null) => void;
  previewUrls?: string[];
}

const MultiImageUploader = ({
  files,
  setFiles,
  previewUrls = [],
}: MultiImageUploaderProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { t } = useTranslate();

  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      imageUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);
  const formatImageUrl = (url: string) => {
    if (url.startsWith("http")) {
      // Fix double slashes in the path while preserving the protocol
      return url.replace(/(https?:\/\/[^/]+)\/(\/+)/, "$1/");
    }
    return `${baseUrl}${url.replace(/^\/+/, "")}`;
  };
  useEffect(() => {
    const urls: string[] = [];

    // Process files
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file instanceof File) {
          urls.push(URL.createObjectURL(file));
        } else if (typeof file === "string") {
          urls.push(
            file.startsWith("http")
              ? file
              : `${baseUrl}${file.replace(/^\/+/, "")}`
          );
        }
      });
    }

    // Add preview URLs if no files are present
    if (urls.length === 0 && previewUrls && previewUrls.length > 0) {
      previewUrls.forEach((url) => {
        urls.push(
          url.startsWith("http") ? url : `${baseUrl}${url.replace(/^\/+/, "")}`
        );
      });
    }

    setImageUrls(urls);
  }, [files, previewUrls]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFiles(acceptedFiles);
      }
    },
  });
  useEffect(() => {
    const urls: string[] = [];

    // Process files
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file instanceof File) {
          urls.push(URL.createObjectURL(file));
        } else if (typeof file === "string") {
          urls.push(formatImageUrl(file));
        }
      });
    }

    // Add preview URLs if no files are present
    if (urls.length === 0 && previewUrls && previewUrls.length > 0) {
      previewUrls.forEach((url) => {
        urls.push(formatImageUrl(url));
      });
    }

    setImageUrls(urls);
  }, [files, previewUrls]);
  const removeImage = (index: number) => {
    if (files && files.length > 0) {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles.length > 0 ? (newFiles as File[]) : null);
    } else if (previewUrls && previewUrls.length > 0) {
      const newUrls = [...previewUrls];
      newUrls.splice(index, 1);
      setImageUrls(newUrls.map((url) => formatImageUrl(url)));
    }
  };

  const removeAllImages = () => {
    setFiles(null);
    setImageUrls([]);
  };

  return (
    <div className="w-full">
      {imageUrls.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group h-48">
                <img
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                  src={url}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={removeAllImages}
            className="mt-2"
          >
            {t("Remove all images")}
          </Button>
        </div>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="w-full text-center border-dashed border-2 rounded-md py-12 flex items-center flex-col cursor-pointer hover:border-primary transition-colors">
            <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
              <Upload className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium mb-1 text-foreground">
              {t("Drop images here or click to upload")}
            </h4>
            <div className="text-sm text-muted-foreground">
              {t("Supports multiple images (PNG, JPG, JPEG, GIF)")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
