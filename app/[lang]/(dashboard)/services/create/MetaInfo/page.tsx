"use client";

import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { CreateMedia } from "@/services/auth/auth";
import { KeywordsInput } from "./KeywordsInput";
import { StructuredDataInput } from "./StructuredDataInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, CheckCircle, X } from "lucide-react";

// Define Zod schema for meta info validation with all required fields
const metaInfoSchema = z.object({
  title: z
    .string()
    .min(1, "Meta title is required")
    .max(60, "Title should be less than 60 characters"),
  description: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Description should be less than 160 characters"),
  keywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .min(1, "At least one keyword is required"),
  canonicalUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Canonical URL is required"),
  ogTitle: z
    .string()
    .min(1, "OG Title is required")
    .max(60, "OG Title should be less than 60 characters"),
  ogDescription: z
    .string()
    .min(1, "OG Description is required")
    .max(160, "OG Description should be less than 160 characters"),
  ogImage: z.string().min(1, "Image URL is required"),
  ogUrl: z.string().url("Invalid URL format").min(1, "OG URL is required"),
  ogType: z.string().min(1, "OG Type is required"),
  structuredData: z
    .record(z.any())
    .refine((data) => Object.keys(data).length > 0, {
      message: "Structured data cannot be empty",
    }),
  headScript: z.string().min(1, "Head script is required"),
  bodyScript: z.string().min(1, "Body script is required"),
});

type MetaInfoFormData = z.infer<typeof metaInfoSchema>;

interface MetaInfoProps {
  service: any;
  setService: (service: any) => void;
  lang: "en" | "ar";
}

export interface MetaInfoRef {
  validateForm: () => Promise<boolean>;
  getFormData: () => MetaInfoFormData;
}

const MetaInfo = forwardRef<MetaInfoRef, MetaInfoProps>(
  ({ service, setService, lang }, ref) => {
    const { t } = useTranslate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState({
      loading: false,
      success: false,
      message: "",
    });

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      getValues,
      trigger,
      watch,
    } = useForm<MetaInfoFormData>({
      resolver: zodResolver(metaInfoSchema),
      defaultValues: {
        title: service.meta?.title || "",
        description: service.meta?.description || "",
        keywords: service.meta?.keywords || [],
        canonicalUrl: service.meta?.canonicalUrl || "",
        ogTitle: service.meta?.ogTitle || "",
        ogDescription: service.meta?.ogDescription || "",
        ogImage: service.meta?.ogImage || "",
        ogUrl: service.meta?.ogUrl || "",
        ogType: service.meta?.ogType || "website",
        structuredData: service.meta?.structuredData || {},
        headScript: service.meta?.headScript || "",
        bodyScript: service.meta?.bodyScript || "",
      },
      mode: "onChange",
    });

    // Expose validation to parent component
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const isValid = await trigger();
        if (isValid) {
          setService({
            ...service,
            meta: getValues(),
          });
        }
        return isValid && !uploadStatus.loading;
      },
      getFormData: () => getValues(),
    }));

    const updateField = (field: keyof MetaInfoFormData, value: any) => {
      setValue(field, value);
      setService({
        ...service,
        meta: {
          ...getValues(),
          [field]: value,
        },
      });
    };

    const handleKeywordsChange = (keywords: string[]) => {
      updateField("keywords", keywords);
    };

    const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadStatus({ loading: true, success: false, message: "" });

      if (!file.type.startsWith("image/")) {
        setUploadStatus({
          loading: false,
          success: false,
          message: "Please select a valid image file",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({
          loading: false,
          success: false,
          message: "File size should be less than 5MB",
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("alt[0]", file.name.replace(/\.[^/.]+$/, ""));

        const imageResponse = await CreateMedia(formData, lang);

        if (imageResponse?.[0]) {
          const newImage = imageResponse[0].url;
          updateField("ogImage", newImage);
          setUploadStatus({
            loading: false,
            success: true,
            message: "Image uploaded successfully",
          });
          setTimeout(
            () => setUploadStatus((prev) => ({ ...prev, message: "" })),
            3000
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadStatus({
          loading: false,
          success: false,
          message: "Failed to upload image",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    const clearImage = () => {
      updateField("ogImage", "");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("Meta Information")}
          </h2>
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
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    updateField("title", e.target.value);
                  }}
                  placeholder={t("Title for search engines (50-60 characters)")}
                  className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                />
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">
                {t(errors.title.message)}
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <Label className="text-sm font-medium">
              {t("Meta Description")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    updateField("description", e.target.value);
                  }}
                  placeholder={t(
                    "Description for search engines (150-160 characters)"
                  )}
                  className={`mt-1 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows={3}
                />
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {t(errors.description.message)}
              </p>
            )}
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <KeywordsInput
              value={watch("keywords") || []}
              onChange={handleKeywordsChange}
            />
            {errors.keywords && (
              <p className="text-xs text-red-500 mt-1">
                {t(errors.keywords.message)}
              </p>
            )}
          </div>

          {/* Canonical URL */}
          <div>
            <Label className="text-sm font-medium">
              {t("Canonical URL")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="canonicalUrl"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    updateField("canonicalUrl", e.target.value);
                  }}
                  placeholder="https://example.com/services/your-service"
                  className={`mt-1 ${
                    errors.canonicalUrl ? "border-red-500" : ""
                  }`}
                />
              )}
            />
            {errors.canonicalUrl && (
              <p className="text-xs text-red-500 mt-1">
                {t(errors.canonicalUrl.message)}
              </p>
            )}
          </div>

          {/* Open Graph Section */}
          <div className="pt-4 border-t mt-4">
            <h3 className="font-medium text-lg mb-3">
              {t("Open Graph / Social Media")}
            </h3>

            {/* OG Title */}
            <div className="mb-4">
              <Label className="text-sm font-medium">
                {t("OG Title")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="ogTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateField("ogTitle", e.target.value);
                    }}
                    placeholder={t("Title for social media shares")}
                    className={`mt-1 ${errors.ogTitle ? "border-red-500" : ""}`}
                  />
                )}
              />
              {errors.ogTitle && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.ogTitle.message)}
                </p>
              )}
            </div>

            {/* OG Description */}
            <div className="mb-4">
              <Label className="text-sm font-medium">
                {t("OG Description")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="ogDescription"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateField("ogDescription", e.target.value);
                    }}
                    placeholder={t("Description for social media shares")}
                    className={`mt-1 ${
                      errors.ogDescription ? "border-red-500" : ""
                    }`}
                    rows={3}
                  />
                )}
              />
              {errors.ogDescription && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.ogDescription.message)}
                </p>
              )}
            </div>

            {/* OG Image */}
            <div className="mb-4">
              <Label className="text-sm font-medium">
                {t("OG Image")} <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploadStatus.loading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    {uploadStatus.loading && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">
                          {t("Uploading image")}
                        </span>
                      </>
                    )}
                    {uploadStatus.success && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          {t(uploadStatus.message)}
                        </span>
                      </>
                    )}
                    {uploadStatus.message &&
                      !uploadStatus.success &&
                      !uploadStatus.loading && (
                        <span className="text-sm text-red-500">
                          {t(uploadStatus.message)}
                        </span>
                      )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("Recommended size")}
                  </p>
                </div>

                {/* Image Preview */}
                {watch("ogImage") && (
                  <div className="relative inline-block">
                    <img
                      src={watch("ogImage")}
                      alt="OG Image Preview"
                      className="max-w-xs max-h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title={t("Remove image")}
                      disabled={uploadStatus.loading}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {errors.ogImage && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.ogImage.message)}
                </p>
              )}
            </div>

            {/* OG URL */}
            <div className="mb-4">
              <Label className="text-sm font-medium">
                {t("OG URL")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="ogUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateField("ogUrl", e.target.value);
                    }}
                    placeholder="https://example.com/services/your-service"
                    className={`mt-1 ${errors.ogUrl ? "border-red-500" : ""}`}
                  />
                )}
              />
              {errors.ogUrl && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.ogUrl.message)}
                </p>
              )}
            </div>

            {/* OG Type */}
            <div>
              <Label className="text-sm font-medium">
                {t("OG Type")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="ogType"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      updateField("ogType", e.target.value);
                    }}
                    placeholder="website, article, etc."
                    className={`mt-1 ${errors.ogType ? "border-red-500" : ""}`}
                  />
                )}
              />
              {errors.ogType && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.ogType.message)}
                </p>
              )}
            </div>
          </div>

          {/* Structured Data */}
          <div className="pt-4 border-t mt-4">
            <h3 className="font-medium text-lg mb-3">
              {t("Structured Data")} <span className="text-red-500">*</span>
            </h3>
            <Controller
              name="structuredData"
              control={control}
              render={({ field }) => (
                <div>
                  <StructuredDataInput
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      updateField("structuredData", value);
                    }}
                  />
                  {errors.structuredData && (
                    <p className="text-xs text-red-500 mt-1">
                      {t(errors.structuredData.message)}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Scripts */}
          <div className="pt-4 border-t mt-4">
            <h3 className="font-medium text-lg mb-3">
              {t("Custom Scripts")} <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  {t("Head Script")} <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="headScript"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateField("headScript", e.target.value);
                        }}
                        placeholder="<script>...</script>"
                        className={`mt-1 font-mono text-xs ${
                          errors.headScript ? "border-red-500" : ""
                        }`}
                        rows={3}
                      />
                      {errors.headScript && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.headScript.message)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  {t("Body Script")} <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="bodyScript"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateField("bodyScript", e.target.value);
                        }}
                        placeholder="<script>...</script>"
                        className={`mt-1 font-mono text-xs ${
                          errors.bodyScript ? "border-red-500" : ""
                        }`}
                        rows={3}
                      />
                      {errors.bodyScript && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.bodyScript.message)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MetaInfo.displayName = "MetaInfo";

export default MetaInfo;
