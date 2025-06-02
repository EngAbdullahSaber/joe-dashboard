"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";
import { baseUrl } from "@/services/app.config";
import { useEffect, useState } from "react";

interface ImageUploaderProps {
  file: File | string | null;
  setFile: (file: File | null) => void;
  previewUrl?: string | null;
}

const ImageUploader = ({ file, setFile, previewUrl }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { t } = useTranslate();

  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else if (typeof file === "string") {
      setImageUrl(
        file.startsWith("http") ? file : `${baseUrl}${file.replace(/^\/+/, "")}`
      );
    } else if (previewUrl) {
      setImageUrl(
        previewUrl.startsWith("http")
          ? previewUrl
          : `${baseUrl}${previewUrl.replace(/^\/+/, "")}`
      );
    } else {
      setImageUrl(null);
    }
  }, [file, previewUrl]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile) {
        setFile(uploadedFile);
      }
    },
  });

  const closeTheFile = () => {
    setFile(null);
    setImageUrl(null);
  };

  return (
    <div className={imageUrl ? "h-[300px] w-full" : ""}>
      {imageUrl ? (
        <div className="w-full h-full relative">
          <Button
            type="button"
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-default-900 hover:bg-background hover:text-default-900 z-20"
            onClick={closeTheFile}
          >
            <span className="text-xl">
              <Icon icon="fa6-solid:xmark" />
            </span>
          </Button>
          <img
            alt="Uploaded"
            className="w-full h-full object-cover rounded-md"
            src={imageUrl}
          />
        </div>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
            <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
              <Upload className="text-default-500" />
            </div>
            <h4 className="text-2xl font-medium mb-1 text-card-foreground/80">
              {t("Drop image here or click to upload")}
            </h4>
            <div className="text-xs text-muted-foreground">
              {t("(upload blog image here)")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
