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

interface HeroSectionData {
  serviceName: { en: string; ar: string };
  title: { en: string; ar: string };
  images: string[];
  attr: Attribute[];
}

interface HeroSectionProps {
  service: HeroSectionData;
  setService: React.Dispatch<React.SetStateAction<HeroSectionData>>;
  lang: "en" | "ar";
}

const HeroSection: React.FC<HeroSectionProps> = ({
  service,
  setService,
  lang,
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize service with empty values if undefined
  const safeService = service || {
    serviceName: { en: "", ar: "" },
    title: { en: "", ar: "" },
    images: [],
    attr: [],
  };

  // Handle bilingual field changes
  const handleBilingualChange = (
    field: "serviceName" | "title",
    lang: "en" | "ar",
    value: string
  ) => {
    setService((prev) => ({
      ...(prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
      }),
      [field]: {
        ...(prev?.[field] || { en: "", ar: "" }),
        [lang]: value,
      },
    }));
  };

  // Handle attribute changes
  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    lang: "en" | "ar",
    value: string
  ) => {
    setService((prev) => {
      const current = prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
      };
      const updatedAttr = [...current.attr];
      updatedAttr[index] = {
        ...(updatedAttr[index] || {
          key: { en: "", ar: "" },
          value: { en: "", ar: "" },
        }),
        [field]: {
          ...(updatedAttr[index]?.[field] || { en: "", ar: "" }),
          [lang]: value,
        },
      };
      return { ...current, attr: updatedAttr };
    });
  };

  // Add new attribute
  const addAttribute = () => {
    setService((prev) => ({
      ...(prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
      }),
      attr: [
        ...(prev?.attr || []),
        {
          key: { en: "", ar: "" },
          value: { en: "", ar: "" },
        },
      ],
    }));
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setService((prev) => {
      const current = prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
      };
      const updatedAttr = [...current.attr];
      updatedAttr.splice(index, 1);
      return { ...current, attr: updatedAttr };
    });
  };

  // Handle image upload
  const handleFileSelect = async (
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
      const newImages = responses.flatMap((response) =>
        response.map((item: any) => item.url)
      );

      // Update the service state with the new images
      setService((prev) => ({
        ...(prev || {
          serviceName: { en: "", ar: "" },
          title: { en: "", ar: "" },
          images: [],
          attr: [],
        }),
        images: [...(prev?.images || []), ...newImages],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert(t("Failed to upload images. Please try again."));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setService((prev) => {
      const current = prev || {
        serviceName: { en: "", ar: "" },
        title: { en: "", ar: "" },
        images: [],
        attr: [],
      };
      const updatedImages = [...current.images];
      updatedImages.splice(index, 1);
      return { ...current, images: updatedImages };
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
              <Input
                value={safeService.serviceName.en}
                onChange={(e) =>
                  handleBilingualChange("serviceName", "en", e.target.value)
                }
                placeholder={t("Enter service name in English")}
                required
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {t("Arabic")}
              </Label>
              <Input
                value={safeService.serviceName.ar}
                onChange={(e) =>
                  handleBilingualChange("serviceName", "ar", e.target.value)
                }
                placeholder={t("Enter service name in Arabic")}
                required
                dir="rtl"
              />
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
              <Input
                value={safeService.title.en}
                onChange={(e) =>
                  handleBilingualChange("title", "en", e.target.value)
                }
                placeholder={t("Enter title in English")}
                required
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {t("Arabic")}
              </Label>
              <Input
                value={safeService.title.ar}
                onChange={(e) =>
                  handleBilingualChange("title", "ar", e.target.value)
                }
                placeholder={t("Enter title in Arabic")}
                required
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Images Upload Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Hero Images")}
          </Label>

          <div className="space-y-3">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB each"
                )}
              </p>
            </div>

            {/* Images Preview */}
            {safeService.images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {safeService.images.map((image, index) => (
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
                    >
                      ×
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
            {safeService.attr.map((attribute, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-medium">
                    {t("Attribute")} #{index + 1}
                  </Label>
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    {t("Remove")}
                  </button>
                </div>

                {/* Key Field */}
                <div className="mb-3">
                  <Label className="block text-sm font-medium mb-1">
                    {t("Key")}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        {t("English")}
                      </Label>
                      <Input
                        value={attribute.key.en}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "key",
                            "en",
                            e.target.value
                          )
                        }
                        placeholder={t("Enter key in English")}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        {t("Arabic")}
                      </Label>
                      <Input
                        value={attribute.key.ar}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "key",
                            "ar",
                            e.target.value
                          )
                        }
                        placeholder={t("Enter key in Arabic")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Value Field */}
                <div>
                  <Label className="block text-sm font-medium mb-1">
                    {t("Value")}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        {t("English")}
                      </Label>
                      <Input
                        value={attribute.value.en}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "value",
                            "en",
                            e.target.value
                          )
                        }
                        placeholder={t("Enter value in English")}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        {t("Arabic")}
                      </Label>
                      <Input
                        value={attribute.value.ar}
                        onChange={(e) =>
                          handleAttributeChange(
                            index,
                            "value",
                            "ar",
                            e.target.value
                          )
                        }
                        placeholder={t("Enter value in Arabic")}
                        dir="rtl"
                      />
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
};

export default HeroSection;
