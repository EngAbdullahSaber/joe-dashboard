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
import { Loader2, CheckCircle } from "lucide-react";

// Define Zod schema for validation
const callToActionSchema = z.object({
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
      .min(1, "English subtitle is required")
      .max(150, "Subtitle must be less than 150 characters"),
    ar: z
      .string()
      .min(1, "Arabic subtitle is required")
      .max(150, "Subtitle must be less than 150 characters"),
  }),
  content: z.object({
    en: z
      .string()
      .min(1, "English content is required")
      .max(500, "Content must be less than 500 characters"),
    ar: z
      .string()
      .min(1, "Arabic content is required")
      .max(500, "Content must be less than 500 characters"),
  }),
  image: z.object({
    url: z.string().min(1, "Image is required"),
    alt: z.string().optional(),
  }),
});

type CallToActionFormData = z.infer<typeof callToActionSchema>;

interface CallToActionSectionProps {
  call: CallToActionFormData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

export interface CallToActionRef {
  validateForm: () => Promise<boolean>;
  getFormData: () => CallToActionFormData;
  getUploadStatus?: () => boolean;
}

const CallToActionSection = forwardRef<
  CallToActionRef,
  CallToActionSectionProps
>(({ call, setService, lang }, ref) => {
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
  } = useForm<CallToActionFormData>({
    resolver: zodResolver(callToActionSchema),
    defaultValues: {
      title: {
        en: call?.title?.en || "",
        ar: call?.title?.ar || "",
      },
      subTitle: {
        en: call?.subTitle?.en || "",
        ar: call?.subTitle?.ar || "",
      },
      content: {
        en: call?.content?.en || "",
        ar: call?.content?.ar || "",
      },
      image: {
        url: call?.image?.url || "",
        alt: call?.image?.alt || "",
      },
    },
    mode: "onChange",
  });

  // Watch for form changes
  const watchedValues = watch();

  // Sync form with parent state when props change
  useEffect(() => {
    reset({
      title: {
        en: call?.title?.en || "",
        ar: call?.title?.ar || "",
      },
      subTitle: {
        en: call?.subTitle?.en || "",
        ar: call?.subTitle?.ar || "",
      },
      content: {
        en: call?.content?.en || "",
        ar: call?.content?.ar || "",
      },
      image: {
        url: call?.image?.url || "",
        alt: call?.image?.alt || "",
      },
    });
  }, [call, reset]);

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

  // Expose validation methods to parent component
  useImperativeHandle(
    ref,
    () => ({
      validateForm: async () => {
        const isValid = await trigger();
        if (isValid) {
          setService((prev: any) => ({
            ...prev,
            call: getValues(),
          }));
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
        <h2 className="text-xl font-semibold mb-4">{t("Call to Action")}</h2>
        <p className="text-gray-600 mb-6">
          {t("Configure the call to action section for your service")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Title Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Title")} <span className="text-red-500">*</span>
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

        {/* Subtitle Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Subtitle")} <span className="text-red-500">*</span>
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

        {/* Content Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Content")} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {t("English")}
              </Label>
              <Controller
                name="content.en"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("Enter content in English")}
                    className={errors.content?.en ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.content?.en && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.content.en.message)}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {t("Arabic")}
              </Label>
              <Controller
                name="content.ar"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("Enter content in Arabic")}
                    className={errors.content?.ar ? "border-red-500" : ""}
                    dir="rtl"
                  />
                )}
              />
              {errors.content?.ar && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.content.ar.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Image")} <span className="text-red-500">*</span>
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
});

CallToActionSection.displayName = "CallToActionSection";

export default CallToActionSection;
