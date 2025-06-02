import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";

interface Attribute {
  key: { en: string; ar: string };
  value: { en: string; ar: string };
}

interface Partner {
  url: string;
  alt: string;
}

interface PartnersSectionData {
  serviceName: { en: string; ar: string };
  title: { en: string; ar: string };
  images: string[];
  attr: Attribute[];
  partners: Partner[];
}

interface PartnersSectionProps {
  service: PartnersSectionData;
  setService: React.Dispatch<React.SetStateAction<PartnersSectionData>>;
  lang: "en" | "ar";
}

const PartnersSection: React.FC<PartnersSectionProps> = ({
  service,
  setService,
  lang,
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const partnersFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize service with empty values if undefined
  const safeService = service || {
    serviceName: { en: "", ar: "" },
    title: { en: "", ar: "" },
    images: [],
    attr: [],
    partners: [],
  };

  // ... (keep all existing functions like handleBilingualChange, handleAttributeChange, etc.)

  // Handle partners image upload
  const handlePartnersFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Validate all files first
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          alert(t("Please select valid image files"));
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(t("File size should be less than 5MB"));
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
      const newPartners = responses.flatMap((response) =>
        response.map((item: any) => ({
          url: item.url,
          alt: item.alternativeText || "",
        }))
      );

      // Update the service state with the new partners
      setService((prev) => ({
        ...(prev || {
          serviceName: { en: "", ar: "" },
          title: { en: "", ar: "" },
          images: [],
          attr: [],
          partners: [],
        }),
        partners: [...(prev?.partners || []), ...newPartners],
      }));
    } catch (error) {
      console.error("Error uploading partner images:", error);
      alert(t("Failed to upload partner images. Please try again."));
      if (partnersFileInputRef.current) {
        partnersFileInputRef.current.value = "";
      }
    }
  };

  // Update partner alt text
  const handlePartnerAltChange = (index: number, value: string) => {
    setService((prev) => {
      const current = prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
        partners: [],
      };
      const updatedPartners = [...current.partners];
      updatedPartners[index] = {
        ...updatedPartners[index],
        alt: value,
      };
      return { ...current, partners: updatedPartners };
    });
  };

  // Remove partner
  const removePartner = (index: number) => {
    setService((prev) => {
      const current = prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
        partners: [],
      };
      const updatedPartners = [...current.partners];
      updatedPartners.splice(index, 1);
      return { ...current, partners: updatedPartners };
    });
  };

  return (
    <div className="space-y-6">
      {/* ... (keep existing sections like service name, title, etc.) */}

      {/* Partners Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">
          {t("Partners")}
        </Label>
        <div className="space-y-3">
          <div>
            <input
              ref={partnersFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePartnersFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB each")}
            </p>
          </div>

          {/* Partners Preview */}
          {safeService.partners.length > 0 && (
            <div className="space-y-4">
              {safeService.partners.map((partner, index) => (
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
                    </div>
                    <div className="flex-grow">
                      <div className="mb-3">
                        <Label className="block text-sm font-medium mb-1">
                          {t("Alt Text")}
                        </Label>
                        <Input
                          value={partner.alt}
                          onChange={(e) =>
                            handlePartnerAltChange(index, e.target.value)
                          }
                          placeholder={t("Enter alt text for the partner logo")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ... (keep existing sections like attributes) */}
    </div>
  );
};

export default PartnersSection;
