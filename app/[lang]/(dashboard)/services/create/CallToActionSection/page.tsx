"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";

interface CallToActionImage {
  url: string;
  alt: string;
}

interface CallToActionData {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  image: CallToActionImage;
}

interface CallToActionSectionProps {
  call: CallToActionData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  call,
  setService,
  lang,
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize call with empty values if undefined
  const safeCall = call || {
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    content: { en: "", ar: "" },
    image: { url: "", alt: "" },
  };

  // Handle bilingual field changes
  const handleBilingualChange = (
    field: keyof CallToActionData,
    subField: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => ({
      ...prev,
      call: {
        ...prev.call,
        [field]: {
          ...prev.call[field],
          [subField]: value,
        },
      },
    }));
  };

  // Handle image upload
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert(t("Please select a valid image file"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(t("File size should be less than 5MB"));
        return;
      }

      const formData = new FormData();
      formData.append("files", file);
      formData.append("alt[0]", file.name.replace(/\.[^/.]+$/, ""));

      const response = await CreateMedia(formData, lang);
      const uploadedImage = response[0];

      setService((prev: any) => ({
        ...prev,
        call: {
          ...prev.call,
          image: {
            url: uploadedImage.url,
            alt: uploadedImage.alternativeText || "",
          },
        },
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t("Failed to upload image. Please try again."));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Update image alt text
  const handleImageAltChange = (value: string) => {
    setService((prev: any) => ({
      ...prev,
      call: {
        ...prev.call,
        image: {
          ...prev.call.image,
          alt: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">{t("Title")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs text-gray-500 mb-1">English</Label>
            <Input
              value={safeCall.title.en}
              onChange={(e) =>
                handleBilingualChange("title", "en", e.target.value)
              }
              placeholder="Enter title in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeCall.title.ar}
              onChange={(e) =>
                handleBilingualChange("title", "ar", e.target.value)
              }
              placeholder="Enter title in Arabic"
            />
          </div>
        </div>
      </div>

      {/* Subtitle Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">
          {t("Subtitle")}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs text-gray-500 mb-1">English</Label>
            <Input
              value={safeCall.subTitle.en}
              onChange={(e) =>
                handleBilingualChange("subTitle", "en", e.target.value)
              }
              placeholder="Enter subtitle in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeCall.subTitle.ar}
              onChange={(e) =>
                handleBilingualChange("subTitle", "ar", e.target.value)
              }
              placeholder="Enter subtitle in Arabic"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">{t("Content")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs text-gray-500 mb-1">English</Label>
            <Input
              value={safeCall.content.en}
              onChange={(e) =>
                handleBilingualChange("content", "en", e.target.value)
              }
              placeholder="Enter content in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeCall.content.ar}
              onChange={(e) =>
                handleBilingualChange("content", "ar", e.target.value)
              }
              placeholder="Enter content in Arabic"
            />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">{t("Image")}</Label>
        <div className="space-y-3">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB")}
            </p>
          </div>

          {safeCall.image.url && (
            <div className="border p-4 rounded-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={`${ImageUrl}${safeCall.image.url}`}
                    alt={safeCall.image.alt}
                    className="w-32 h-32 object-contain rounded-md border"
                  />
                </div>
                <div className="flex-grow">
                  <div className="mb-3">
                    <Label className="block text-sm font-medium mb-1">
                      {t("Alt Text")}
                    </Label>
                    <Input
                      value={safeCall.image.alt}
                      onChange={(e) => handleImageAltChange(e.target.value)}
                      placeholder={t("Enter alt text for the image")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;
