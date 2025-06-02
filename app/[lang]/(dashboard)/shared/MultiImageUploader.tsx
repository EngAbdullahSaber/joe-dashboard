"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { DeleteProjectImage } from "@/services/projects/projects";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";

interface ImageFile {
  file: File | string;
  alt: string;
  url: string;
  id?: string; // Add this
  projectId?: string;
}

const MultiImageUploader = ({
  files = [],
  setFiles,
  projectId,
}: {
  files: ImageFile[];
  setFiles: (files: ImageFile[]) => void;
  projectId: string | number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang } = useParams();

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        alt: "",
      }));
      setFiles([...files, ...newImages]);
    },
  });

  const { t } = useTranslate();

  const removeFile = async (index: number) => {
    const target = files[index];

    // Case 1: File is uploaded (has `id` and `url`)
    if ("id" in target && "url" in target) {
      try {
        // Call your delete API
        const data = {
          imageId: target.id,
        };
        await DeleteProjectImage(projectId, lang, data); // Replace this with your actual API call
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        reToast.success(t("Image Deleted From Project"));
        console.log(`Deleted file with id: ${target.id}`);
      } catch (error) {
        reToast.success(t("Something Went Wrong"));

        console.error("Error deleting file:", error);
      }
    }

    // Case 2: File is a newly added `File` object (not yet uploaded)
    if ("file" in target) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      console.log(`Removed unsaved file at index: ${index}`);
    }
  };

  const updateAltText = (index: number, alt: string) => {
    const updatedFiles = [...files];
    updatedFiles[index] = {
      ...updatedFiles[index],
      alt,
    };
    setFiles(updatedFiles);
  };

  const handleAddMoreClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  console.log(files);
  return (
    <div>
      {files.length > 0 ? (
        <div className="space-y-4">
          {files.map((image, index) => (
            <div key={index} className="border rounded-md p-4 relative">
              <Button
                type="button"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90 text-white z-20 p-0"
                onClick={() => removeFile(index)}
              >
                <Icon icon="fa6-solid:xmark" className="h-4 w-4" />
              </Button>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 h-40">
                  <img
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-md"
                    src={
                      image.file instanceof File
                        ? URL.createObjectURL(image.file)
                        : `${ImageUrl}${image.url}`
                    }
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <Input
                    type="text"
                    placeholder="Image alternative text"
                    value={image.alt}
                    onChange={(e) => updateAltText(index, e.target.value)}
                    required
                  />
                  {!image.alt && (
                    <p className="text-xs text-red-500 mt-1">
                      {t("Alternative text is required")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="w-full text-center border-dashed border rounded-md py-[52px] flex items-center flex-col">
            <div className="h-12 w-12 inline-flex rounded-md bg-muted items-center justify-center mb-3">
              <Upload className="text-default-500" />
            </div>
            <h4 className="text-2xl font-medium mb-1 text-card-foreground/80">
              {t("Drop images here or click to upload")}
            </h4>
            <div className="text-xs text-muted-foreground">
              {t("(upload multiple images here)")}
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          {/* Simple button that triggers file input */}
          <Button type="button" variant="outline" onClick={handleAddMoreClick}>
            <Icon icon="lucide:plus" className="mr-2" />
            {t("Add More Images")}
          </Button>
          {/* Hidden input connected to the button */}
          <input
            {...getInputProps()}
            ref={inputRef}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
