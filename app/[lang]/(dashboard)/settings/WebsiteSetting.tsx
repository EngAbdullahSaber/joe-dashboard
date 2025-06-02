"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { getSetting, UpdateSetting } from "@/services/setting/setting";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "../shared/ImageUploader";
import { translateToArabic, translateToEnglish } from "@/services/auth/auth";

type LangKey = "en" | "ar";

interface WebsiteSettings {
  about_us_footer: { ar: string; en: string };
  address: { ar: string; en: string };
  site_name: { ar: string; en: string };
  site_logo_url: string | File | null;
  site_logo_alt: string;
  favicon_url: string | File | null;
  favicon_alt: string;
}

const WebsiteSetting = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [autoTranslate, setAutoTranslate] = useState(true);

  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<LangKey>("en");
  const [formData, setFormData] = useState<WebsiteSettings>({
    about_us_footer: { ar: "", en: "" },
    address: { ar: "", en: "" },
    site_name: { ar: "", en: "" },
    site_logo_url: "",
    site_logo_alt: "",
    favicon_url: "",
    favicon_alt: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await getSetting(lang as string);
      const firstItem = res?.data?.[0];
      if (firstItem) {
        setFormData({
          about_us_footer: firstItem.about_us_footer || { ar: "", en: "" },
          address: firstItem.address || { ar: "", en: "" },
          site_name: firstItem.site_name || { ar: "", en: "" },
          site_logo_url: firstItem.site_logo_url || "",
          site_logo_alt: firstItem.site_logo_alt || "",
          favicon_url: firstItem.favicon_url || "",
          favicon_alt: firstItem.favicon_alt || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(t("Failed to load settings"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof WebsiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLangFieldChange = async (
    key: "about_us_footer" | "address" | "site_name",
    value: string,
    lang: "en" | "ar"
  ) => {
    // First update the current field
    setFormData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));

    // Auto-translate from English to Arabic when checkbox is checked
    if (autoTranslate && lang === "en" && value.trim()) {
      try {
        const translated = await translateToArabic(value);
        if (translated && translated !== value) {
          setFormData((prev) => ({
            ...prev,
            [key]: { ...prev[key], ar: translated },
          }));
        }
      } catch (error) {
        console.error("Auto-translation failed:", error);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Append language-specific fields
      formDataToSend.append("about_us_footer[en]", formData.about_us_footer.en);
      formDataToSend.append("about_us_footer[ar]", formData.about_us_footer.ar);
      formDataToSend.append("address[en]", formData.address.en);
      formDataToSend.append("address[ar]", formData.address.ar);
      formDataToSend.append("site_name[en]", formData.site_name.en);
      formDataToSend.append("site_name[ar]", formData.site_name.ar);

      // Append file fields
      if (formData.site_logo_url instanceof File) {
        formDataToSend.append("site_logo_url", formData.site_logo_url);
      } else if (formData.site_logo_url) {
        formDataToSend.append("site_logo_url", formData.site_logo_url);
      }

      if (formData.favicon_url instanceof File) {
        formDataToSend.append("favicon_url", formData.favicon_url);
      } else if (formData.favicon_url) {
        formDataToSend.append("favicon_url", formData.favicon_url);
      }

      // Append other fields
      formDataToSend.append("site_logo_alt", formData.site_logo_alt);
      formDataToSend.append("favicon_alt", formData.favicon_alt);

      await UpdateSetting(formDataToSend, 1, lang as string);
      toast.success(t("Settings updated successfully"));
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t("Failed to update settings"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs
      defaultValue="en"
      className="flex flex-col gap-6"
      onValueChange={(val) => setActiveLang(val as LangKey)}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("Website Setting Section")}</CardTitle>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="en">{t("English")}</TabsTrigger>
            <TabsTrigger value="ar">{t("Arabic")}</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          <TabsContent value="en">
            <div className="flex items-end justify-end my-4 gap-2 mt-4">
              <input
                type="checkbox"
                id="autoTranslate"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="autoTranslate">
                {t("Auto-translate to Arabic")}
              </Label>
            </div>
            <MultilingualFields
              t={t}
              formData={formData}
              activeLang="en"
              handleLangFieldChange={handleLangFieldChange}
            />
            <CommonFields
              t={t}
              formData={formData}
              handleChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="ar">
            <MultilingualFields
              t={t}
              formData={formData}
              activeLang="ar"
              handleLangFieldChange={handleLangFieldChange}
            />
          </TabsContent>
        </CardContent>

        <CardFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? t("Loading") : t("Save Changes")}
          </Button>
        </CardFooter>
      </Card>
    </Tabs>
  );
};

const MultilingualFields = ({
  t,
  formData,
  activeLang,
  handleLangFieldChange,
}: {
  t: (key: string) => string;
  formData: WebsiteSettings;
  activeLang: "en" | "ar";
  handleLangFieldChange: (
    key: "about_us_footer" | "address" | "site_name",
    value: string,
    lang: "en" | "ar"
  ) => Promise<void>;
}) => {
  const [localFields, setLocalFields] = useState({
    about_us_footer: formData.about_us_footer[activeLang],
    address: formData.address[activeLang],
    site_name: formData.site_name[activeLang],
  });

  useEffect(() => {
    setLocalFields({
      about_us_footer: formData.about_us_footer[activeLang],
      address: formData.address[activeLang],
      site_name: formData.site_name[activeLang],
    });
  }, [formData, activeLang]);

  const handleLocalChange = (key: keyof typeof localFields, value: string) => {
    setLocalFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = async (key: keyof typeof localFields) => {
    await handleLangFieldChange(key, localFields[key], activeLang);
  };

  return (
    <div className="space-y-4">
      <InputField
        label={t("About Us Footer")}
        type="text"
        value={localFields.about_us_footer}
        onChange={(e) => handleLocalChange("about_us_footer", e.target.value)}
        onBlur={() => handleBlur("about_us_footer")}
        placeholder={t("Enter footer description")}
      />
      <InputField
        label={t("Address")}
        type="text"
        value={localFields.address}
        onChange={(e) => handleLocalChange("address", e.target.value)}
        onBlur={() => handleBlur("address")}
        placeholder={t("Enter address")}
      />
      <InputField
        label={t("Site Name")}
        type="text"
        value={localFields.site_name}
        onChange={(e) => handleLocalChange("site_name", e.target.value)}
        onBlur={() => handleBlur("site_name")}
        placeholder={t("Enter Site Name")}
      />
    </div>
  );
};

const CommonFields = ({
  t,
  formData,
  handleChange,
}: {
  t: (key: string) => string;
  formData: WebsiteSettings;
  handleChange: (key: keyof WebsiteSettings, value: any) => void;
}) => (
  <div className="space-y-4 mt-6">
    <div className="space-y-1">
      <Label>{t("Site Logo")}</Label>
      <ImageUploader
        file={formData.site_logo_url}
        setFile={(file) => handleChange("site_logo_url", file)}
      />
    </div>

    <InputField
      label={t("Site Logo Alternative Text")}
      type="text"
      value={formData.site_logo_alt}
      onChange={(e) => handleChange("site_logo_alt", e.target.value)}
      placeholder={t("Enter Logo Alternative Text")}
    />

    <div className="space-y-1">
      <Label>{t("Favicon")}</Label>
      <ImageUploader
        file={formData.favicon_url}
        setFile={(file) => handleChange("favicon_url", file)}
      />
    </div>

    <InputField
      label={t("Favicon Alternative Text")}
      type="text"
      value={formData.favicon_alt}
      onChange={(e) => handleChange("favicon_alt", e.target.value)}
      placeholder={t("Enter favicon Alternative Text")}
    />
  </div>
);

const InputField = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  label: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder: string;
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input
      value={value}
      type={type}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  </div>
);

export default WebsiteSetting;
