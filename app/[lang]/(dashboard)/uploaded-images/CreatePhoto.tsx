"use client";

import React, { useRef, useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { CreatePhoto as CreatePhotoApi } from "@/services/photos/photos";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface CreatePhotoProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const CreatePhoto = ({ flag, setFlag }: CreatePhotoProps) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      reToast.error(t("Please select an image file"));
      return;
    }
    if (!name.trim()) {
      reToast.error(t("Image name is required"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("photo", file);

      const res = await CreatePhotoApi(formData, lang);
      if (res) {
        reToast.success(t("Image uploaded successfully"));
        setFlag(!flag);
        setOpen(false);
        setName("");
        setFile(null);
        setPreview(null);
      }
    } catch (error) {
      reToast.error(t("Failed to upload image"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setFile(null);
    setPreview(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
        else setOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Icon icon="heroicons:plus" className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
          {t("Upload Image")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[440px] !h-auto">
        <DialogHeader>
          <DialogTitle>{t("Upload New Image")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-name">{t("Image Name")}</Label>
            <Input
              id="photo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Enter image name")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo-file">{t("Select Image")}</Label>
            <Input
              id="photo-file"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          {preview && (
            <div className="relative rounded-lg overflow-hidden border border-default-200 bg-default-50 h-48">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={loading || !file}>
              {loading ? (
                <>
                  <Icon
                    icon="heroicons:arrow-path"
                    className="w-4 h-4 ltr:mr-2 rtl:ml-2 animate-spin"
                  />
                  {t("Uploading")}
                </>
              ) : (
                <>
                  <Icon
                    icon="heroicons:cloud-arrow-up"
                    className="w-4 h-4 ltr:mr-2 rtl:ml-2"
                  />
                  {t("Upload")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePhoto;
