"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";

interface BenefitFeature {
  en: string;
  ar: string;
}

interface BenefitImage {
  url: string;
  alt: string;
}

interface BenefitsData {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  feature: BenefitFeature[];
  image: BenefitImage;
}

interface BenefitsSectionProps {
  benefits: BenefitsData;
  setService: React.Dispatch<React.SetStateAction<any>>; // Adjusted to match your usage
  lang: "en" | "ar";
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits,
  setService,
  lang,
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize benefits with empty values if undefined
  const safeBenefits = benefits || {
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    feature: [],
    image: { url: "", alt: "" },
  };

  // Handle bilingual field changes
  const handleBilingualChange = (
    field: keyof BenefitsData,
    subField: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [field]: {
          ...prev.benefits[field],
          [subField]: value,
        },
      },
    }));
  };

  // Handle feature changes
  const handleFeatureChange = (
    index: number,
    field: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => {
      const updatedFeatures = [...prev.benefits.feature];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value,
      };
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          feature: updatedFeatures,
        },
      };
    });
  };

  // Add new feature
  const addFeature = () => {
    setService((prev: any) => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        feature: [...prev.benefits.feature, { en: "", ar: "" }],
      },
    }));
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setService((prev: any) => {
      const updatedFeatures = [...prev.benefits.feature];
      updatedFeatures.splice(index, 1);
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          feature: updatedFeatures,
        },
      };
    });
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
        benefits: {
          ...prev.benefits,
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
      benefits: {
        ...prev.benefits,
        image: {
          ...prev.benefits.image,
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
              value={safeBenefits.title.en}
              onChange={(e) =>
                handleBilingualChange("title", "en", e.target.value)
              }
              placeholder="Enter title in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeBenefits.title.ar}
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
              value={safeBenefits.subTitle.en}
              onChange={(e) =>
                handleBilingualChange("subTitle", "en", e.target.value)
              }
              placeholder="Enter subtitle in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeBenefits.subTitle.ar}
              onChange={(e) =>
                handleBilingualChange("subTitle", "ar", e.target.value)
              }
              placeholder="Enter subtitle in Arabic"
            />
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

        {safeBenefits.feature.length > 0 ? (
          <div className="space-y-4">
            {safeBenefits.feature.map((feature, index) => (
              <div key={index} className="border p-4 rounded-md">
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
                      English
                    </Label>
                    <Input
                      value={feature.en}
                      onChange={(e) =>
                        handleFeatureChange(index, "en", e.target.value)
                      }
                      placeholder="Enter feature in English"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Arabic
                    </Label>
                    <Input
                      value={feature.ar}
                      onChange={(e) =>
                        handleFeatureChange(index, "ar", e.target.value)
                      }
                      placeholder="Enter feature in Arabic"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t("No features added yet")}</p>
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
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB")}
            </p>
          </div>

          {safeBenefits.image.url && (
            <div className="border p-4 rounded-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={`${ImageUrl}${safeBenefits.image.url}`}
                    alt={safeBenefits.image.alt}
                    className="w-32 h-32 object-contain rounded-md border"
                  />
                </div>
                <div className="flex-grow">
                  <div className="mb-3">
                    <Label className="block text-sm font-medium mb-1">
                      {t("Alt Text")}
                    </Label>
                    <Input
                      value={safeBenefits.image.alt}
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

export default BenefitsSection;
