"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { CreateMedia } from "@/services/auth/auth";
import { KeywordsInput } from "./KeywordsInput";
import { StructuredDataInput } from "./StructuredDataInput";

interface MetaInfoProps {
  service: any;
  setService: (service: any) => void;
  lang: "en" | "ar";
}

const MetaInfo: React.FC<MetaInfoProps> = ({ service, setService, lang }) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (path: string, value: any) => {
    setService((prev: any) => {
      const newService = { ...prev };
      const keys = path.split(".");
      let current = newService;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newService;
    });
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(",").map((k) => k.trim());
    updateField("meta.keywords", keywords);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(t("Please select a valid image file"));
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("File size should be less than 5MB"));
        return;
      }

      try {
        // Create FormData and append the file
        const formData = new FormData();
        formData.append("files", file);
        formData.append(
          "alt[0]",
          service.meta.ogImageAlt || file.name.replace(/\.[^/.]+$/, "")
        );

        // Upload the image (assuming CreateMedia is imported)
        const imageResponse = await CreateMedia(formData, lang);

        if (imageResponse && imageResponse.length > 0) {
          const uploadedImage = imageResponse[0];

          // Update the meta with the uploaded image data
          updateField("meta.ogImage", uploadedImage.url);
          updateField(
            "meta.ogImageAlt",
            uploadedImage.alt || file.name.replace(/\.[^/.]+$/, "")
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(t("Failed to upload image. Please try again."));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const clearImage = () => {
    updateField("meta.ogImage", "");
    updateField("meta.ogImageAlt", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("Meta Information")}</h2>
        <p className="text-gray-600 mb-6">
          {t("SEO and social media metadata for your service")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Meta Title */}
        <div>
          <Label className="text-sm font-medium">
            {t("Meta Title")} <span className="text-red-500">*</span>
          </Label>
          <Input
            value={service.meta?.title || ""}
            onChange={(e) => updateField("meta.title", e.target.value)}
            placeholder={t("Title for search engines (50-60 characters)")}
            required
            className="mt-1"
          />
        </div>

        {/* Meta Description */}
        <div>
          <Label className="text-sm font-medium">
            {t("Meta Description")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={service.meta?.description || ""}
            onChange={(e) => updateField("meta.description", e.target.value)}
            placeholder={t(
              "Description for search engines (150-160 characters)"
            )}
            required
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Keywords */}
        <div className="mb-4">
          <KeywordsInput
            value={service.meta?.keywords || []}
            onChange={(keywords) => updateField("meta.keywords", keywords)}
          />
        </div>

        {/* Canonical URL */}
        <div>
          <Label className="text-sm font-medium">{t("Canonical URL")}</Label>
          <Input
            value={service.meta?.canonicalUrl || ""}
            onChange={(e) => updateField("meta.canonicalUrl", e.target.value)}
            placeholder="https://example.com/services/your-service"
            className="mt-1"
          />
        </div>

        {/* Open Graph Section */}
        <div className="pt-4 border-t mt-4">
          <h3 className="font-medium text-lg mb-3">
            {t("Open Graph / Social Media")}
          </h3>

          {/* OG Title */}
          <div className="mb-4">
            <Label className="text-sm font-medium">{t("OG Title")}</Label>
            <Input
              value={service.meta?.ogTitle || ""}
              onChange={(e) => updateField("meta.ogTitle", e.target.value)}
              placeholder={t("Title for social media shares")}
              className="mt-1"
            />
          </div>

          {/* OG Description */}
          <div className="mb-4">
            <Label className="text-sm font-medium">{t("OG Description")}</Label>
            <Textarea
              value={service.meta?.ogDescription || ""}
              onChange={(e) =>
                updateField("meta.ogDescription", e.target.value)
              }
              placeholder={t("Description for social media shares")}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* OG Image */}
          <div className="mb-4">
            <Label className="text-sm font-medium">{t("OG Image")}</Label>
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
                  {t("Recommended size: 1200×630 pixels. Max size: 5MB")}
                </p>
              </div>

              {/* Image Preview */}
              {service.meta?.ogImage && (
                <div className="relative inline-block">
                  <img
                    src={service.meta.ogImage}
                    alt={service.meta.ogImageAlt || "Preview"}
                    className="max-w-xs max-h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title={t("Remove image")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* OG URL */}
          <div className="mb-4">
            <Label className="text-sm font-medium">{t("OG URL")}</Label>
            <Input
              value={service.meta?.ogUrl || ""}
              onChange={(e) => updateField("meta.ogUrl", e.target.value)}
              placeholder="https://example.com/services/your-service"
              className="mt-1"
            />
          </div>

          {/* OG Type */}
          <div>
            <Label className="text-sm font-medium">{t("OG Type")}</Label>
            <Input
              value={service.meta?.ogType || "website"}
              onChange={(e) => updateField("meta.ogType", e.target.value)}
              placeholder="website, article, etc."
              className="mt-1"
            />
          </div>
        </div>

        {/* Structured Data */}
        <div className="pt-4 border-t mt-4">
          <h3 className="font-medium text-lg mb-3">{t("Structured Data")}</h3>
          <StructuredDataInput
            value={service.meta?.structuredData || {}}
            onChange={(data) => updateField("meta.structuredData", data)}
          />
        </div>
        {/* Scripts */}
        <div className="pt-4 border-t mt-4">
          <h3 className="font-medium text-lg mb-3">{t("Custom Scripts")}</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">{t("Head Script")}</Label>
              <Textarea
                value={service.meta?.headScript || ""}
                onChange={(e) => updateField("meta.headScript", e.target.value)}
                placeholder="<script>...</script>"
                className="mt-1 font-mono text-xs"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">{t("Body Script")}</Label>
              <Textarea
                value={service.meta?.bodyScript || ""}
                onChange={(e) => updateField("meta.bodyScript", e.target.value)}
                placeholder="<script>...</script>"
                className="mt-1 font-mono text-xs"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaInfo;
