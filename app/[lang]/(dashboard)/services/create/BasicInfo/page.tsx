import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";

interface BasicInfoProps {
  service: {
    slug: string;
    title: { en: string; ar: string };
    subTitle: { en: string; ar: string };
    image: { url: string; alt: string };
  };
  setService: React.Dispatch<
    React.SetStateAction<{
      slug: string;
      title: { en: string; ar: string };
      subTitle: { en: string; ar: string };
      image: { url: string; alt: string };
    }>
  >;
  lang: "en" | "ar"; // Add language prop
}

const BasicInfo: React.FC<BasicInfoProps> = ({ service, setService, lang }) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text field changes
  const handleTextChange = (field: keyof typeof service, value: string) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };

  // Handle bilingual field changes (title/subTitle)
  const handleBilingualChange = (
    field: "title" | "subTitle",
    lang: "en" | "ar",
    value: string
  ) => {
    setService((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  // Handle image upload
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
          service.image.alt || file.name.replace(/\.[^/.]+$/, "")
        );

        // Upload the image
        const imageResponse = await CreateMedia(formData, lang);

        if (imageResponse && imageResponse.length > 0) {
          const uploadedImage = imageResponse[0];

          // Update the service state with the uploaded image data
          setService((prev) => ({
            ...prev,
            image: {
              url: uploadedImage.url, // Use the URL from the response
              alt:
                uploadedImage.alt ||
                service.image.alt ||
                file.name.replace(/\.[^/.]+$/, ""),
            },
          }));
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

  // Clear image selection
  const clearImage = () => {
    setService((prev) => ({
      ...prev,
      image: {
        url: "",
        alt: "",
      },
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("Basic Information")}</h2>
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
          <Input
            id="slug"
            type="text"
            value={service.slug}
            onChange={(e) => handleTextChange("slug", e.target.value)}
            placeholder="e.g., hr-services"
            required
          />
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
              <Input
                value={service.title.en}
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
                value={service.title.ar}
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
              <Input
                value={service.subTitle.en}
                onChange={(e) =>
                  handleBilingualChange("subTitle", "en", e.target.value)
                }
                placeholder={t("Enter subtitle in English")}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {t("Arabic")}
              </Label>
              <Input
                value={service.subTitle.ar}
                onChange={(e) =>
                  handleBilingualChange("subTitle", "ar", e.target.value)
                }
                placeholder={t("Enter subtitle in Arabic")}
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Service Image")}
          </Label>

          {/* File Input */}
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

            {/* Image Preview */}
            {service.image.url && (
              <div className="relative inline-block">
                <img
                  src={service.image.url}
                  alt={service.image.alt || "Preview"}
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
      </div>
    </div>
  );
};

export default BasicInfo;
