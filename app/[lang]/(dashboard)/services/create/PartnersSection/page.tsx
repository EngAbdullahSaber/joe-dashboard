"use client";
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, CheckCircle } from "lucide-react";

// Define Zod schema for validation
const partnersSchema = z.object({
  partners: z
    .array(
      z.object({
        url: z.string().min(1, "Image URL is required"),
        alt: z.string().min(1, "Alt text is required"),
      })
    )
    .min(3, "At least 3 partner images are required"), // Add minimum length validation
});

type PartnersFormData = z.infer<typeof partnersSchema>;

interface MediaResponse {
  url: string;
  alternativeText: string;
}

interface Partner {
  url: string;
  alt: string;
}

interface PartnersSectionProps {
  service: {
    partners: Partner[];
  };
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

export interface PartnersSectionRef {
  validateForm: () => Promise<boolean>;
  getUploadStatus?: () => boolean;
}

const PartnersSection = forwardRef<PartnersSectionRef, PartnersSectionProps>(
  ({ service, setService, lang }, ref) => {
    const { t } = useTranslate();
    const partnersFileInputRef = useRef<HTMLInputElement>(null);
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
    } = useForm<PartnersFormData>({
      resolver: zodResolver(partnersSchema),
      defaultValues: {
        partners: service.partners || [],
      },
      mode: "onChange",
    });

    const watchedValues = watch();

    React.useEffect(() => {
      setValue("partners", service.partners || []);
    }, [service.partners, setValue]);

    const handlePartnersFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploadStatus({ loading: true, success: false, message: "" });

      try {
        // Validate files first
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) {
            setUploadStatus({
              loading: false,
              success: false,
              message: "Please select valid image files",
            });
            setError(`partners.${i}.url`, {
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
            setError(`partners.${i}.url`, {
              type: "manual",
              message: "File too large",
            });
            return;
          }
        }

        // Upload files
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("files", file);
          formData.append("alt[0]", file.name.replace(/\.[^/.]+$/, ""));
          const response = await CreateMedia(formData, lang);
          return response.map((item: MediaResponse) => ({
            url: item.url,
            alt: item.alternativeText || file.name.replace(/\.[^/.]+$/, ""),
          }));
        });

        const responses = await Promise.all(uploadPromises);
        const newPartners = responses.flat();

        const updatedPartners = [...getValues().partners, ...newPartners];
        setValue("partners", updatedPartners);
        setService((prev) => ({
          ...prev,
          partners: updatedPartners,
        }));

        await trigger("partners");
        setUploadStatus({
          loading: false,
          success: true,
          message: "Images uploaded successfully",
        });

        if (partnersFileInputRef.current) {
          partnersFileInputRef.current.value = "";
        }

        setTimeout(() => {
          setUploadStatus((prev) => ({ ...prev, message: "" }));
        }, 3000);
      } catch (error) {
        console.error("Error uploading partner images:", error);
        setUploadStatus({
          loading: false,
          success: false,
          message: "Failed to upload images. Please try again.",
        });
        if (partnersFileInputRef.current) {
          partnersFileInputRef.current.value = "";
        }
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        validateForm: async () => {
          const isValid = await trigger();
          if (!isValid) {
            // Show error message if less than 3 partners
            if (getValues().partners.length < 3) {
              setError("partners", {
                type: "manual",
                message: "At least 3 partner images are required",
              });
            }
            return false;
          }
          return isValid && !uploadStatus.loading;
        },
        getUploadStatus: () => uploadStatus.loading,
      }),
      [trigger, uploadStatus.loading, getValues, setError]
    );

    const handlePartnerAltChange = (index: number, value: string) => {
      const updatedPartners = [...getValues().partners];
      updatedPartners[index] = {
        ...updatedPartners[index],
        alt: value,
      };
      setValue("partners", updatedPartners);
      setService((prev) => ({
        ...prev,
        partners: updatedPartners,
      }));
      trigger(`partners.${index}.alt`);
    };

    const removePartner = (index: number) => {
      const updatedPartners = [...getValues().partners];
      updatedPartners.splice(index, 1);
      setValue("partners", updatedPartners);
      setService((prev) => ({
        ...prev,
        partners: updatedPartners,
      }));
      trigger("partners");
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {t("Partners Section")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Add partner logos and information")}
          </p>
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Partners")} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            {t("Minimum 3 partner images required")}
          </p>
          <div className="space-y-3">
            <div>
              <input
                ref={partnersFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePartnersFileSelect}
                disabled={uploadStatus.loading}
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer ${
                  errors.partners ? "border-red-500" : ""
                }`}
              />

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
                {errors.partners?.message && !uploadStatus.loading && (
                  <span className="text-sm text-red-500">
                    {t(errors.partners.message)}
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

            {watchedValues.partners.length > 0 && (
              <div className="space-y-4">
                {watchedValues.partners.map((partner, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-medium">
                        {t("Partner")} #{index + 1}
                      </Label>
                      <button
                        type="button"
                        onClick={() => removePartner(index)}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        {t("Remove")}
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={`${ImageUrl}${partner.url}`}
                          alt={partner.alt}
                          className="w-32 h-32 object-contain rounded-md border"
                        />
                        {errors.partners?.[index]?.url && (
                          <p className="text-xs text-red-500 mt-1">
                            {t(errors.partners[index]?.url?.message)}
                          </p>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="mb-3">
                          <Label className="block text-sm font-medium mb-1">
                            {t("Alt Text")}{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={partner.alt}
                            onChange={(e) =>
                              handlePartnerAltChange(index, e.target.value)
                            }
                            placeholder={t(
                              "Enter alt text for the partner logo"
                            )}
                            className={
                              errors.partners?.[index]?.alt
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors.partners?.[index]?.alt && (
                            <p className="text-xs text-red-500 mt-1">
                              {t(errors.partners[index]?.alt?.message)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PartnersSection.displayName = "PartnersSection";

export default PartnersSection;
