"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { getServicesById, UpdateServices } from "@/services/service/service";
import { CreateMedia } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseUrl } from "@/services/app.config";
import ImageUploader from "../ImageUploader";

type Partner = {
  url: string;
  alt: string;
};

type CallSection = {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  image: {
    url: string;
    alt: string;
  };
};

type ServiceData = {
  id: string;
  partners?: Partner[];
  call?: CallSection;
};

const page = () => {
  const { t } = useTranslate();
  const { lang, id } = useParams();
  const [data, setData] = useState<ServiceData | null>(null);

  const [callImageFile, setCallImageFile] = useState<File | null>(null);
  const getData = async () => {
    try {
      const res = await getServicesById(lang, id);
      setData(res || {});
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [lang]);

  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<{
      message?: string | { english?: string; arabic?: string };
      error?: string;
    }>;

    let errorMessage = t("Update failed");
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data;
      if (typeof responseData.message === "string") {
        errorMessage = responseData.message;
      } else if (typeof responseData.message === "object") {
        errorMessage =
          lang === "en"
            ? responseData.message.english || errorMessage
            : responseData.message.arabic || errorMessage;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      }
    }

    reToast.error(errorMessage);
  };

  return <div></div>;
};

export default page;
