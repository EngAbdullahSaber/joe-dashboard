// Fixed BasicInfo Component

"use client";

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ImageUrl } from "@/services/app.config";
import { Loader2, CheckCircle } from "lucide-react"; // Import icons for status

// Define Zod schema with proper validation
const serviceSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),
  title: z.object({
    en: z
      .string()
      .min(1, "English title is required")
      .max(100, "Title must be less than 100 characters"),
    ar: z
      .string()
      .min(1, "Arabic title is required")
      .max(100, "Title must be less than 100 characters"),
  }),
  subTitle: z.object({
    en: z
      .string()
      .min(1, "English subTitle is required")
      .max(150, "subTitle must be less than 150 characters"),
    ar: z
      .string()
      .min(1, "Arabic subTitle is required")
      .max(150, "subTitle must be less than 150 characters"),
  }),

  image: z.object({
    url: z.string().min(1, "Image URL is required"), // Accepts both relative and absolute
    alt: z.string().optional(), // optional or .nullable() if you want null too
  }),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface BasicInfoProps {
  service: ServiceFormData;
  setService: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  lang: "en" | "ar";
}

// Define the ref interface for parent component to call validation
export interface BasicInfoRef {
  validateForm: () => Promise<boolean>;
  getFormData: () => ServiceFormData;
  getUploadStatus?: () => boolean; // Optional to maintain backward compatibility
}

const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>(
  ({ service, setService, lang }, ref) => {
    const { t } = useTranslate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<{
      loading: boolean;
      success: boolean;
      message: string;
    }>({ loading: false, success: false, message: "" });
    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      setValue,
      trigger,
      getValues,
      watch,
      setError,
      clearErrors,
      reset,
    } = useForm<ServiceFormData>({
      resolver: zodResolver(serviceSchema),
      defaultValues: {
        slug: service.slug || "",
        title: {
          en: service.title?.en || "",
          ar: service.title?.ar || "",
        },
        subTitle: {
          en: service.subTitle?.en || "",
          ar: service.subTitle?.ar || "",
        },
        image: {
          url: service.image?.url || "",
          alt: service.image?.alt || "",
        },
      },
      mode: "onChange",
    });

    // Watch for form changes to sync with parent state
    const watchedValues = watch();

    // Sync form values with parent service prop when it changes
    useEffect(() => {
      reset({
        slug: service.slug || "",
        title: {
          en: service.title?.en || "",
          ar: service.title?.ar || "",
        },
        subTitle: {
          en: service.subTitle?.en || "",
          ar: service.subTitle?.ar || "",
        },
        image: {
          url: service.image?.url || "",
          alt: service.image?.alt || "",
        },
      });
    }, [service, reset]);

    const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Reset upload status
      setUploadStatus({ loading: true, success: false, message: "" });

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadStatus({
          loading: false,
          success: false,
          message: "Please select a valid image file",
        });
        setError("image.url", { type: "manual", message: "Invalid file type" });
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({
          loading: false,
          success: false,
          message: "File size should be less than 5MB",
        });
        setError("image.url", { type: "manual", message: "File too large" });
        return;
      }

      try {
        const formData = new FormData();
        formData.append("files", file);
        formData.append(
          "alt[0]",
          getValues().image?.alt || file.name.replace(/\.[^/.]+$/, "")
        );

        const imageResponse = await CreateMedia(formData, lang);

        if (imageResponse?.[0]) {
          const newImage = {
            url: imageResponse[0].url,
            alt: imageResponse[0].alt || file.name.replace(/\.[^/.]+$/, ""),
          };
          setValue("image", newImage);
          clearErrors("image.url");
          await trigger("image");

          setUploadStatus({
            loading: false,
            success: true,
            message: "Image uploaded successfully",
          });

          // Clear success message after 3 seconds
          setTimeout(() => {
            setUploadStatus((prev) => ({ ...prev, message: "" }));
          }, 3000);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadStatus({
          loading: false,
          success: false,
          message: "Failed to upload image. Please try again.",
        });
        setError("image.url", {
          type: "manual",
          message: "Upload failed",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    // Expose validation method to parent component
    useImperativeHandle(
      ref,
      () => ({
        validateForm: async () => {
          const isValid = await trigger();
          if (isValid) {
            setService(getValues());
          }
          return isValid && !uploadStatus.loading;
        },
        getFormData: () => getValues(),
        getUploadStatus: () => uploadStatus.loading,
      }),
      [trigger, getValues, setService, uploadStatus.loading]
    );
    // Clear image selection
    const clearImage = async () => {
      setValue("image", { url: "", alt: "" });
      clearErrors("image.url");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await trigger("image");
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("Basic Information")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Enter the basic details for your service")}
          </p>
        </div>

        <div className="space-y-4">
          {/* Slug Field */}
          <div>
            <Label htmlFor="slug" className="block text-sm font-medium mb-1">
              {t("Service Slug")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="e.g., hr-services"
                  className={errors.slug ? "border-red-500" : ""}
                />
              )}
            />
            {errors.slug && (
              <p className="text-xs text-red-500 mt-1">
                {t(errors.slug.message)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {t("URL-friendly identifier (lowercase, hyphens, no spaces)")}
            </p>
          </div>

          {/* Title Field (Bilingual) */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Service Title")} <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("English")}
                </Label>
                <Controller
                  name="title.en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      name="title.en"
                      placeholder={t("Enter title in English")}
                      className={errors.title?.en ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.title?.en && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.title.en.message)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("Arabic")}
                </Label>
                <Controller
                  name="title.ar"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      name="title.ar"
                      placeholder={t("Enter title in Arabic")}
                      className={errors.title?.ar ? "border-red-500" : ""}
                      dir="rtl"
                    />
                  )}
                />
                {errors.title?.ar && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.title.ar.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Subtitle Field (Bilingual) */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Service Subtitle")}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("English")}
                </Label>
                <Controller
                  name="subTitle.en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      name="subTitle.en"
                      placeholder={t("Enter subtitle in English")}
                      className={errors.subTitle?.en ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.subTitle?.en && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.subTitle.en.message)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("Arabic")}
                </Label>
                <Controller
                  name="subTitle.ar"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      name="subTitle.ar"
                      placeholder={t("Enter subtitle in Arabic")}
                      className={errors.subTitle?.ar ? "border-red-500" : ""}
                      dir="rtl"
                    />
                  )}
                />
                {errors.subTitle?.ar && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.subTitle.ar.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Service Image")}
            </Label>
            <div className="space-y-3">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer ${
                    errors.image?.url ? "border-red-500" : ""
                  }`}
                  disabled={uploadStatus.loading}
                />

                {/* Upload status indicator */}
                <div className="mt-2 flex items-center gap-2">
                  {uploadStatus.loading && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">
                        {t("Uploading image")}
                      </span>
                    </>
                  )}
                  {uploadStatus.success && !uploadStatus.loading && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {t(uploadStatus.message)}
                      </span>
                    </>
                  )}
                  {errors.image?.url && !uploadStatus.loading && (
                    <span className="text-sm text-red-500">
                      {t(errors.image.url.message)}
                    </span>
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
                  {t("Supported formats")}
                </p>
              </div>

              {/* Image Preview */}
              {watchedValues.image?.url && (
                <div className="relative inline-block">
                  <img
                    src={ImageUrl + watchedValues.image.url}
                    alt={watchedValues.image.alt || "Preview"}
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
          </div>
        </div>
      </div>
    );
  }
);

BasicInfo.displayName = "BasicInfo";

export default BasicInfo;
