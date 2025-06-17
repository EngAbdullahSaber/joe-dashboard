"use client";

import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";

// Define Zod schema for validation
const benefitsSchema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required").max(100),
    ar: z.string().min(1, "Arabic title is required").max(100),
  }),
  subTitle: z.object({
    en: z.string().min(1, "English subtitle is required").max(150),
    ar: z.string().min(1, "Arabic subtitle is required").max(150),
  }),
  feature: z.array(
    z.object({
      en: z.string().min(1, "English feature is required").max(200),
      ar: z.string().min(1, "Arabic feature is required").max(200),
    })
  ),
  image: z.object({
    url: z.string().min(1, "Image URL is required"),
    alt: z.string().optional(),
  }),
});

type BenefitsFormData = z.infer<typeof benefitsSchema>;

interface BenefitsSectionProps {
  benefits: BenefitsFormData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

export interface BenefitsSectionRef {
  validateForm: () => Promise<boolean>;
  getUploadStatus?: () => boolean;
}

const BenefitsSection = forwardRef<BenefitsSectionRef, BenefitsSectionProps>(
  ({ benefits, setService, lang }, ref) => {
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
      formState: { errors },
      setValue,
      trigger,
      getValues,
      watch,
      setError,
      clearErrors,
      reset,
    } = useForm<BenefitsFormData>({
      resolver: zodResolver(benefitsSchema),
      defaultValues: {
        title: benefits?.title || { en: "", ar: "" },
        subTitle: benefits?.subTitle || { en: "", ar: "" },
        feature: benefits?.feature || [],
        image: benefits?.image || { url: "", alt: "" },
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "feature",
    });

    // Watch for form changes to sync with parent state
    const watchedValues = watch();

    // Sync form values with parent service prop when it changes
    useEffect(() => {
      reset({
        title: benefits?.title || { en: "", ar: "" },
        subTitle: benefits?.subTitle || { en: "", ar: "" },
        feature: benefits?.feature || [],
        image: benefits?.image || { url: "", alt: "" },
      });
    }, [benefits, reset]);

    // Handle image upload
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

        const response = await CreateMedia(formData, lang);
        const uploadedImage = response[0];

        const newImage = {
          url: uploadedImage.url,
          alt: uploadedImage.alternativeText || "",
        };

        setValue("image", newImage);
        clearErrors("image.url");
        await trigger("image");

        setUploadStatus({
          loading: false,
          success: true,
          message: "Image uploaded successfully",
        });

        // Update parent state
        setService((prev: any) => ({
          ...prev,
          benefits: {
            ...prev.benefits,
            image: newImage,
          },
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus((prev) => ({ ...prev, message: "" }));
        }, 3000);
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
            setService((prev: any) => ({
              ...prev,
              benefits: getValues(),
            }));
          }
          return isValid && !uploadStatus.loading;
        },
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

      // Update parent state
      setService((prev: any) => ({
        ...prev,
        benefits: {
          ...prev.benefits,
          image: { url: "", alt: "" },
        },
      }));
    };

    // Add new feature
    const addFeature = () => {
      append({ en: "", ar: "" });
    };

    // Remove feature
    const removeFeature = (index: number) => {
      remove(index);
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("Benefits Section")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Configure the benefits of your service")}
          </p>
        </div>

        {/* Title Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Title")} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("English")}
              </Label>
              <Controller
                name="title.en"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.title?.en ? "border-red-500" : ""}
                    placeholder="Enter title in English"
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
              <Label className="block text-xs text-gray-500 mb-1">
                {t("Arabic")}
              </Label>
              <Controller
                name="title.ar"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.title?.ar ? "border-red-500" : ""}
                    placeholder="Enter title in Arabic"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("English")}
              </Label>
              <Controller
                name="subTitle.en"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.subTitle?.en ? "border-red-500" : ""}
                    placeholder="Enter subtitle in English"
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
              <Label className="block text-xs text-gray-500 mb-1">
                {t("Arabic")}
              </Label>
              <Controller
                name="subTitle.ar"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.subTitle?.ar ? "border-red-500" : ""}
                    placeholder="Enter subtitle in Arabic"
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

        {/* Features Section */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="block text-sm font-medium">{t("Features")}</Label>
            <button
              type="button"
              onClick={addFeature}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t("Add Feature")}
            </button>
          </div>

          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-sm font-medium">
                      {t("Feature")} #{index + 1}
                    </Label>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      {t("Remove")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("English")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`feature.${index}.en`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.feature?.[index]?.en
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter feature in English"
                          />
                        )}
                      />
                      {errors.feature?.[index]?.en && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.feature[index]?.en?.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Arabic")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`feature.${index}.ar`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.feature?.[index]?.ar
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter feature in Arabic"
                          />
                        )}
                      />
                      {errors.feature?.[index]?.ar && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.feature[index]?.ar?.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {t("No features added yet")}
            </p>
          )}
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

            {watchedValues.image?.url && (
              <div className="border p-4 rounded-md">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={`${ImageUrl}${watchedValues.image.url}`}
                      alt={watchedValues.image.alt || "Preview"}
                      className="w-32 h-32 object-contain rounded-md border"
                    />
                  </div>
                  <div className="flex-grow relative">
                    <div className="mb-3">
                      <Label className="block text-sm font-medium mb-1">
                        {t("Alt Text")}
                      </Label>
                      <Controller
                        name="image.alt"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Enter alt text for the image")}
                          />
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

BenefitsSection.displayName = "BenefitsSection";

export default BenefitsSection;
