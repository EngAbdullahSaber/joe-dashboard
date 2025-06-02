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

const SocialMedia = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    phone: "",
    working_hours: "",
  });



  
  // Fetch data on mount
  const getData = async () => {
    try {
      const res = await getSetting(lang);
      const firstItem = res?.data?.[0];
      if (firstItem) {
        setFormData({
          email: firstItem.email || "",
          linkedin_url: firstItem.linkedin_url || "",
          facebook_url: firstItem.facebook_url || "",
          twitter_url: firstItem.twitter_url || "",
          instagram_url: firstItem.instagram_url || "",
          phone: firstItem.phone || "",
          working_hours: firstItem.working_hours || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(t("Failed to load settings"));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Handle input changes
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle save
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await UpdateSetting(formData, 1, lang); // or UpdateSetting if that's more accurate
      toast.success(t("Settings updated successfully"));
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t("Failed to update settings"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {" "}
      <CardHeader>
        {" "}
        <CardTitle>{t("Social Media Section")}</CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        <InputField
          label={t("Email")}
          type={"email"}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t("Enter email")}
        />
        <InputField
          type={"text"}
          label={t("Linked In")}
          value={formData.linkedin_url}
          onChange={(e) => handleChange("linkedin_url", e.target.value)}
          placeholder={t("Enter LinkedIn URL")}
        />
        <InputField
          type={"text"}
          label={t("Facebook")}
          value={formData.facebook_url}
          onChange={(e) => handleChange("facebook_url", e.target.value)}
          placeholder={t("Enter Facebook URL")}
        />
        <InputField
          type={"text"}
          label={t("Instagram")}
          value={formData.instagram_url}
          onChange={(e) => handleChange("instagram_url", e.target.value)}
          placeholder={t("Enter Instagram URL")}
        />
        <InputField
          type={"text"}
          label={t("Twitter")}
          value={formData.instagram_url}
          onChange={(e) => handleChange("twitter_url", e.target.value)}
          placeholder={t("Enter Twitter URL")}
        />
        <InputField
          label={t("Phone")}
          type={"number"}
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder={t("Enter phone number")}
        />
        <InputField
          label={t("Working Hours")}
          value={formData.working_hours}
          type={"text"}
          onChange={(e) => handleChange("working_hours", e.target.value)}
          placeholder={t("Enter working hours")}
        />{" "}
      </CardContent>{" "}
      <CardFooter>
        {" "}
        <Button onClick={handleSave} disabled={loading} className="">
          {loading ? t("Loading") : t("Save Changes")}{" "}
        </Button>{" "}
      </CardFooter>{" "}
    </Card>
  );
};

// Reusable Input Field Component
const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input
      value={value}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default SocialMedia;
