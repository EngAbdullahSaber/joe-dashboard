"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";
import { ImageUrl } from "@/services/app.config";

const ImageUploader = ({
  file,
  setFile,
}: {
  file: File | string | null;
  setFile: (file: File | null) => void;
}) => {
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
  const { t } = useTranslate();

  const closeTheFile = () => {
    if (file) {
      setFile(null);
    }
  };
  return (
    <div className={file ? "h-[300px] w-full" : ""}>
      {file ? (
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
            src={
              file instanceof File
                ? URL.createObjectURL(file)
                : `${ImageUrl}${file}`
            }
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
