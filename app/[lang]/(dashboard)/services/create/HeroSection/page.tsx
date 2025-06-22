"use client";

import React, { useImperativeHandle, useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { ImageUrl } from "@/services/app.config";
import { Loader2, CheckCircle, X } from "lucide-react";

// Define Zod schema for attribute
const attributeSchema = z.object({
  key: z.object({
    en: z
      .string()
      .min(1, "English key is required")
      .max(100, "Key must be less than 100 characters"),
    ar: z
      .string()
      .min(1, "Arabic key is required")
      .max(100, "Key must be less than 100 characters"),
  }),
  value: z.object({
    en: z
      .string()
      .min(1, "English value is required")
      .max(200, "Value must be less than 200 characters"),
    ar: z
      .string()
      .min(1, "Arabic value is required")
      .max(200, "Value must be less than 200 characters"),
  }),
});

// Define Zod schema for hero section
const heroSectionSchema = z.object({
  serviceName: z.object({
    en: z
      .string()
      .min(1, "English service name is required")
      .max(100, "Service name must be less than 100 characters"),
    ar: z
      .string()
      .min(1, "Arabic service name is required")
      .max(100, "Service name must be less than 100 characters"),
  }),
  title: z.object({
    en: z
      .string()
      .min(1, "English title is required")
      .max(150, "Title must be less than 150 characters"),
    ar: z
      .string()
      .min(1, "Arabic title is required")
      .max(150, "Title must be less than 150 characters"),
  }),
  images: z
    .array(z.string().min(1, "Image URL is required"))
    .min(1, "At least one image is required"),
  attr: z.array(attributeSchema).optional(),
});

type HeroSectionFormData = z.infer<typeof heroSectionSchema>;

export interface HeroSectionRef {
  validateForm: () => Promise<boolean>;
  getFormData: () => HeroSectionFormData;
  getUploadStatus?: () => boolean;
}

interface HeroSectionProps {
  service: HeroSectionFormData;
  setService: React.Dispatch<React.SetStateAction<HeroSectionFormData>>;
  lang: "en" | "ar";
}

const HeroSection = React.forwardRef<HeroSectionRef, HeroSectionProps>(
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
    } = useForm<HeroSectionFormData>({
      resolver: zodResolver(heroSectionSchema),
      defaultValues: {
        serviceName: {
          en: service?.serviceName?.en || "",
          ar: service?.serviceName?.ar || "",
        },
        title: {
          en: service?.title?.en || "",
          ar: service?.title?.ar || "",
        },
        images: service?.images || [],
        attr: service?.attr || [],
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "attr",
    });

    // Watch for form changes to sync with parent state
    const watchedValues = watch();

    // Sync form values with parent service prop when it changes
    useEffect(() => {
      reset({
        serviceName: {
          en: service?.serviceName?.en || "",
          ar: service?.serviceName?.ar || "",
        },
        title: {
          en: service?.title?.en || "",
          ar: service?.title?.ar || "",
        },
        images: service?.images || [],
        attr: service?.attr || [],
      });
    }, [service, reset]);

    // Handle image upload
    const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Reset upload status
      setUploadStatus({ loading: true, success: false, message: "" });

      try {
        // Validate all files first
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) {
            setUploadStatus({
              loading: false,
              success: false,
              message: "Please select valid image files",
            });
            setError("images", {
              type: "manual",
              message: "Invalid file type",
            });
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            setUploadStatus({
              loading: false,
              success: false,
              message: "File size should be less than 5MB",
            });
            setError("images", { type: "manual", message: "File too large" });
            return;
          }
        }

        // Upload all valid files
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("files", file);
          formData.append("alt[0]", file.name.replace(/\.[^/.]+$/, ""));
          return CreateMedia(formData, lang);
        });

        const responses = await Promise.all(uploadPromises);
        const newImages = responses.flatMap((response) =>
          response.map((item: any) => item.url)
        );

        // Update the form with the new images
        setValue("images", [...getValues().images, ...newImages]);
        clearErrors("images");
        await trigger("images");

        setUploadStatus({
          loading: false,
          success: true,
          message: "Images uploaded successfully",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus((prev) => ({ ...prev, message: "" }));
        }, 3000);
      } catch (error) {
        console.error("Error uploading images:", error);
        setUploadStatus({
          loading: false,
          success: false,
          message: "Failed to upload images. Please try again.",
        });
        setError("images", {
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

    // Remove image
    const removeImage = async (index: number) => {
      const currentImages = getValues().images;
      const updatedImages = [...currentImages];
      updatedImages.splice(index, 1);
      setValue("images", updatedImages);
      await trigger("images");
    };

    // Add new attribute
    const addAttribute = () => {
      append({
        key: { en: "", ar: "" },
        value: { en: "", ar: "" },
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("Hero Section")}</h2>
          <p className="text-gray-600 mb-6">
            {t("Configure the hero section for your service")}
          </p>
        </div>

        <div className="space-y-4">
          {/* Service Name Field (Bilingual) */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Service Name")} <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("English")}
                </Label>
                <Controller
                  name="serviceName.en"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Enter service name in English")}
                      className={errors.serviceName?.en ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.serviceName?.en && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.serviceName.en.message)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">
                  {t("Arabic")}
                </Label>
                <Controller
                  name="serviceName.ar"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Enter service name in Arabic")}
                      dir="rtl"
                      className={errors.serviceName?.ar ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.serviceName?.ar && (
                  <p className="text-xs text-red-500 mt-1">
                    {t(errors.serviceName.ar.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Title Field (Bilingual) */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Hero Title")} <span className="text-red-500">*</span>
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
                      dir="rtl"
                      className={errors.title?.ar ? "border-red-500" : ""}
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

          {/* Images Upload Section */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Hero Images")} <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-3">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer ${
                    errors.images ? "border border-red-500 rounded-md" : ""
                  }`}
                  disabled={uploadStatus.loading}
                />

                {/* Upload status indicator */}
                <div className="mt-2 flex items-center gap-2">
                  {uploadStatus.loading && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">
                        {t("Uploading images")}
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
                  {errors.images && !uploadStatus.loading && (
                    <span className="text-sm text-red-500">
                      {t(errors.images.message || "Image upload error")}
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

              {/* Images Preview */}
              {watchedValues.images?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {watchedValues.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`${ImageUrl}${image}`}
                        alt={`Hero image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        title={t("Remove image")}
                        disabled={uploadStatus.loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Attributes Section */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              {t("Attributes")}
            </Label>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-sm font-medium">
                      {t("Attribute")} #{index + 1}
                    </Label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      {t("Remove")}
                    </button>
                  </div>

                  {/* Key Field */}
                  <div className="mb-3">
                    <Label className="block text-sm font-medium mb-1">
                      {t("Key")} <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">
                          {t("English")}
                        </Label>
                        <Controller
                          name={`attr.${index}.key.en`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Enter key in English")}
                              className={
                                errors.attr?.[index]?.key?.en
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                        {errors.attr?.[index]?.key?.en && (
                          <p className="text-xs text-red-500 mt-1">
                            {t(errors.attr[index]?.key?.en?.message)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">
                          {t("Arabic")}
                        </Label>
                        <Controller
                          name={`attr.${index}.key.ar`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Enter key in Arabic")}
                              dir="rtl"
                              className={
                                errors.attr?.[index]?.key?.ar
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                        {errors.attr?.[index]?.key?.ar && (
                          <p className="text-xs text-red-500 mt-1">
                            {t(errors.attr[index]?.key?.ar?.message)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Value Field */}
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      {t("Value")} <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">
                          {t("English")}
                        </Label>
                        <Controller
                          name={`attr.${index}.value.en`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Enter value in English")}
                              className={
                                errors.attr?.[index]?.value?.en
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                        {errors.attr?.[index]?.value?.en && (
                          <p className="text-xs text-red-500 mt-1">
                            {t(errors.attr[index]?.value?.en?.message)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">
                          {t("Arabic")}
                        </Label>
                        <Controller
                          name={`attr.${index}.value.ar`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Enter value in Arabic")}
                              dir="rtl"
                              className={
                                errors.attr?.[index]?.value?.ar
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                        {errors.attr?.[index]?.value?.ar && (
                          <p className="text-xs text-red-500 mt-1">
                            {t(errors.attr[index]?.value?.ar?.message)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addAttribute}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t("Add Attribute")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
