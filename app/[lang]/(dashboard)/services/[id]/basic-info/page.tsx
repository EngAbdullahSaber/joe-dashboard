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
import MultiImageUploader from "../MultiImageUploader";

type BenefitFeature = {
  en: string;
  ar: string;
};

type BenefitsSection = {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  feature: BenefitFeature[];
  image: {
    url: string;
    alt: string;
  };
};

type ImpactStat = {
  name: {
    en: string;
    ar: string;
  };
  count: string;
  desc: {
    en: string;
    ar: string;
  };
};

type ImpactSection = {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  statics: ImpactStat[];
};

type HeroAttribute = {
  key: {
    en: string;
    ar: string;
  };
  value: {
    en: string;
    ar: string;
  };
};

type HeroSection = {
  serviceName: {
    en: string;
    ar: string;
  };
  title: {
    en: string;
    ar: string;
  };
  images: string[];
  attr: HeroAttribute[];
};

type ServiceData = {
  id: string;
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  image: {
    url: string;
    alt: string;
  };
  hero?: HeroSection;
  benefits?: BenefitsSection;
  impact?: ImpactSection;
};

const page = () => {
  const { t } = useTranslate();
  const { lang, id } = useParams();
  const [data, setData] = useState<ServiceData | null>(null);
  const [editingPartnerIndex, setEditingPartnerIndex] = useState<number | null>(
    null
  );
  const [editingFaqs, setEditingFaqs] = useState(false);
  const [faqsData, setFaqsData] = useState<FAQSection>({
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    list: [],
  });

  const [editingBenefits, setEditingBenefits] = useState(false);
  const [benefitsData, setBenefitsData] = useState<BenefitsSection>({
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    feature: [],
    image: { url: "", alt: "" },
  });
  const [benefitsImageFile, setBenefitsImageFile] = useState<File | null>(null);

  const [callImageFile, setCallImageFile] = useState<File | null>(null);
  const [editingImpact, setEditingImpact] = useState(false);
  const [impactData, setImpactData] = useState<ImpactSection>({
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    statics: [],
  });
  const [newPartner, setNewPartner] = useState<Partner>({ url: "", alt: "" });
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingCall, setEditingCall] = useState(false);
  const [callData, setCallData] = useState<CallSection>({
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    content: { en: "", ar: "" },
    image: { url: "", alt: "" },
  });
  // General service data editing state
  const [editingService, setEditingService] = useState(false);
  const [serviceData, setServiceData] = useState({
    slug: "",
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    image: { url: "", alt: "" },
  });
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);

  // Hero section editing state
  const [editingHero, setEditingHero] = useState(false);
  const [heroData, setHeroData] = useState<HeroSection>({
    serviceName: { en: "", ar: "" },
    title: { en: "", ar: "" },
    images: [],
    attr: [],
  });
  const [heroImageFiles, setHeroImageFiles] = useState<File[]>([]);

  // ... (keep all your existing state for benefits, impact, etc.)

  const getData = async () => {
    try {
      const res = await getServicesById(lang, id);
      setData(res || {});
      if (res?.faqs) {
        setFaqsData(res.faqs);
      }
      if (res?.benefits) {
        setBenefitsData(res.benefits);
      }
      if (res?.impact) {
        setImpactData(res.impact);
      }
      if (res?.call) {
        setCallData(res.call);
      }
      // Set service data
      if (res) {
        setServiceData({
          slug: res.slug || "",
          title: res.title || { en: "", ar: "" },
          subTitle: res.subTitle || { en: "", ar: "" },
          image: res.image || { url: "", alt: "" },
        });
      }

      // Set hero data
      if (res?.hero) {
        setHeroData(res.hero);
      }

      // ... (keep your existing data setting for benefits, impact, etc.)
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [lang]);

  // Service data handlers
  const handleUpdateService = async () => {
    try {
      let imageUrl = serviceData.image.url;

      if (serviceImageFile) {
        try {
          const formData = new FormData();
          formData.append("files", serviceImageFile);
          formData.append("alt[0]", serviceData.image.alt || "");

          const imageResponse = await CreateMedia(formData, lang);
          imageUrl = imageResponse[0];
        } catch (error) {
          handleApiError(error);
          return;
        }
      }

      const payload = {
        ...serviceData,
        image: {
          url: serviceImageFile ? imageUrl.url : serviceData.image.url,
          alt: serviceData.image.alt,
        },
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("Service updated successfully"));
      getData();
      setEditingService(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Hero section handlers
  const handleUpdateHero = async () => {
    try {
      let updatedImages = [...heroData.images];

      // Upload new hero images if files were selected
      if (heroImageFiles.length > 0) {
        try {
          const formData = new FormData();
          heroImageFiles.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("alt[0]", ""); // Add alt text if needed

          const imageResponse = await CreateMedia(formData, lang);
          updatedImages = imageResponse.map((img) => img.url);
        } catch (error) {
          handleApiError(error);
          return;
        }
      }

      const updatedHero = {
        ...heroData,
        images: heroImageFiles.length > 0 ? updatedImages : heroData.images,
      };

      const payload = {
        hero: updatedHero,
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("Hero section updated successfully"));
      getData();
      setEditingHero(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleAddHeroAttribute = () => {
    setHeroData({
      ...heroData,
      attr: [
        ...heroData.attr,
        {
          key: { en: "", ar: "" },
          value: { en: "", ar: "" },
        },
      ],
    });
  };

  const handleRemoveHeroAttribute = (index: number) => {
    const updatedAttr = [...heroData.attr];
    updatedAttr.splice(index, 1);
    setHeroData({
      ...heroData,
      attr: updatedAttr,
    });
  };
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
  const handleHeroAttributeChange = (
    index: number,
    field: "key" | "value",
    lang: "en" | "ar",
    value: string
  ) => {
    const updatedAttr = [...heroData.attr];
    updatedAttr[index] = {
      ...updatedAttr[index],
      [field]: {
        ...updatedAttr[index][field],
        [lang]: value,
      },
    };
    setHeroData({
      ...heroData,
      attr: updatedAttr,
    });
  };

  const handleEditPartner = (index: number) => {
    if (!data?.partners) return;
    setEditingPartnerIndex(index);
    setNewPartner(data.partners[index]);
    setImageFile(null);
  };
  const handleUpdateFaqs = async () => {
    try {
      const payload = {
        faqs: faqsData,
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("FAQs updated successfully"));
      getData();
      setEditingFaqs(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleUpdateBenefits = async () => {
    try {
      let imageUrl = benefitsData.image.url;

      // Upload new image if file was selected
      if (benefitsImageFile) {
        try {
          const formData = new FormData();
          formData.append("files", benefitsImageFile);
          formData.append("alt[0]", benefitsData.image.alt || "");

          const imageResponse = await CreateMedia(formData, lang);
          imageUrl = imageResponse[0];
        } catch (error) {
          handleApiError(error);
          return;
        }
      }

      const updatedBenefits = {
        ...benefitsData,
        image: {
          url: benefitsImageFile ? imageUrl.url : benefitsData.image.url,
          alt: benefitsData.image.alt,
        },
      };

      const payload = {
        benefits: updatedBenefits,
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("Benefits updated successfully"));
      getData();
      setEditingBenefits(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // FAQ item handlers
  const handleAddFaq = () => {
    setFaqsData({
      ...faqsData,
      list: [
        ...faqsData.list,
        {
          question: { en: "", ar: "" },
          answer: { en: "", ar: "" },
        },
      ],
    });
  };

  const handleRemoveFaq = (index: number) => {
    const updatedList = [...faqsData.list];
    updatedList.splice(index, 1);
    setFaqsData({
      ...faqsData,
      list: updatedList,
    });
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    lang: "en" | "ar",
    value: string
  ) => {
    const updatedList = [...faqsData.list];
    updatedList[index] = {
      ...updatedList[index],
      [field]: {
        ...updatedList[index][field],
        [lang]: value,
      },
    };
    setFaqsData({
      ...faqsData,
      list: updatedList,
    });
  };

  // Benefits feature handlers
  const handleAddFeature = () => {
    setBenefitsData({
      ...benefitsData,
      feature: [...benefitsData.feature, { en: "", ar: "" }],
    });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...benefitsData.feature];
    updatedFeatures.splice(index, 1);
    setBenefitsData({
      ...benefitsData,
      feature: updatedFeatures,
    });
  };

  const handleFeatureChange = (
    index: number,
    lang: "en" | "ar",
    value: string
  ) => {
    const updatedFeatures = [...benefitsData.feature];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [lang]: value,
    };
    setBenefitsData({
      ...benefitsData,
      feature: updatedFeatures,
    });
  };
  const handleUpdateImpact = async () => {
    try {
      const payload = {
        impact: impactData,
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("Impact updated successfully"));
      getData();
      setEditingImpact(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleAddStat = () => {
    setImpactData({
      ...impactData,
      statics: [
        ...impactData.statics,
        {
          name: { en: "", ar: "" },
          count: "",
          desc: { en: "", ar: "" },
        },
      ],
    });
  };

  const handleRemoveStat = (index: number) => {
    const updatedStats = [...impactData.statics];
    updatedStats.splice(index, 1);
    setImpactData({
      ...impactData,
      statics: updatedStats,
    });
  };

  const handleStatChange = (
    index: number,
    field: "name" | "desc" | "count",
    lang: "en" | "ar" | null,
    value: string
  ) => {
    const updatedStats = [...impactData.statics];
    if (field === "count") {
      updatedStats[index] = {
        ...updatedStats[index],
        count: value,
      };
    } else if (lang) {
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: {
          ...updatedStats[index][field],
          [lang]: value,
        },
      };
    }
    setImpactData({
      ...impactData,
      statics: updatedStats,
    });
  };
  const handleSavePartner = async () => {
    if (!data?.partners || editingPartnerIndex === null) return;

    let imageUrl = newPartner.url;

    // Upload new image if file was selected
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("files", imageFile);
        formData.append("alt[0]", newPartner.alt || "");

        const imageResponse = await CreateMedia(formData, lang);
        imageUrl = imageResponse[0];
      } catch (error) {
        handleApiError(error);
        return;
      }
    }

    const updatedPartner = {
      url: imageUrl.url,
      alt: newPartner.alt,
    };

    const updatedPartners = [...data.partners];
    updatedPartners[editingPartnerIndex] = updatedPartner;

    await handleUpdatePartners(updatedPartners);
    setEditingPartnerIndex(null);
    setImageFile(null);
  };

  const handleAddPartner = async () => {
    if (!imageFile) {
      reToast.error(t("Please select an image"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", imageFile);
      formData.append("alt[0]", newPartner.alt || "");

      const imageResponse = await CreateMedia(formData, lang);
      const imageUrl = imageResponse[0];

      const updatedPartners = [
        ...(data?.partners || []),
        {
          url: imageUrl.url,
          alt: newPartner.alt,
        },
      ];

      await handleUpdatePartners(updatedPartners);
      setIsAddingPartner(false);
      setNewPartner({ url: "", alt: "" });
      setImageFile(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemovePartner = async (index: number) => {
    if (!data?.partners) return;

    const updatedPartners = [...data.partners];
    updatedPartners.splice(index, 1);

    await handleUpdatePartners(updatedPartners);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };
  // ... (keep all your existing handlers for benefits, impact, etc.)
  const handleUpdatePartners = async (updatedPartners: Partner[]) => {
    try {
      const payload = {
        partners: updatedPartners,
      };

      const response = await UpdateServices(payload, data?.id, lang);

      reToast.success(t("Partners updated successfully"));
      getData();
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const handleUpdateCall = async () => {
    try {
      let imageUrl = callData.image.url;

      // Upload new image if file was selected
      if (callImageFile) {
        try {
          const formData = new FormData();
          formData.append("files", callImageFile);
          formData.append("alt[0]", callData.image.alt || "");

          const imageResponse = await CreateMedia(formData, lang);
          imageUrl = imageResponse[0];
        } catch (error) {
          handleApiError(error);
          return;
        }
      }

      const updatedCall = {
        ...callData,
        image: {
          url: callImageFile ? imageUrl.url : callData.image.url,
          alt: callData.image.alt,
        },
      };

      const payload = {
        call: updatedCall,
      };

      const response = await UpdateServices(payload, data?.id, lang);
      reToast.success(t("Call section updated successfully"));
      getData();
      setEditingCall(false);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  return (
    <div>
      {/* Service Basic Info Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Service Information")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingService(!editingService)}
          >
            {editingService ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingService ? (
            <div className="space-y-4">
              <div>
                <Label>{t("Slug")}</Label>
                <Input
                  value={serviceData.slug}
                  onChange={(e) =>
                    setServiceData({
                      ...serviceData,
                      slug: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={serviceData.title.en}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        title: { ...serviceData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={serviceData.title.ar}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        title: { ...serviceData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Subtitle (English)")}</Label>
                  <Input
                    value={serviceData.subTitle.en}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        subTitle: {
                          ...serviceData.subTitle,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Subtitle (Arabic)")}</Label>
                  <Input
                    value={serviceData.subTitle.ar}
                    onChange={(e) =>
                      setServiceData({
                        ...serviceData,
                        subTitle: {
                          ...serviceData.subTitle,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>{t("Image")}</Label>
                <ImageUploader
                  file={serviceImageFile}
                  setFile={setServiceImageFile}
                  previewUrl={
                    serviceData?.image?.url?.startsWith("http")
                      ? serviceData.image.url
                      : serviceData?.image?.url
                  }
                />
              </div>

              <div>
                <Label>{t("Image Alt Text")}</Label>
                <Input
                  value={serviceData.image.alt}
                  onChange={(e) =>
                    setServiceData({
                      ...serviceData,
                      image: { ...serviceData.image, alt: e.target.value },
                    })
                  }
                />
              </div>

              <Button onClick={handleUpdateService}>{t("Save Changes")}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Slug")}</h4>
                <p className="text-gray-600">{serviceData.slug}</p>
              </div>

              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? serviceData.title.en : serviceData.title.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Subtitle")}</h4>
                <p className="text-gray-600">
                  {lang === "en"
                    ? serviceData.subTitle.en
                    : serviceData.subTitle.ar}
                </p>
              </div>

              {serviceData.image.url && (
                <div>
                  <h4 className="font-medium">{t("Image")}</h4>
                  <img
                    src={
                      serviceData.image.url.startsWith("http")
                        ? serviceData.image.url
                        : `${baseUrl}${serviceData.image.url.replace(
                            /^\/+/,
                            ""
                          )}`
                    }
                    alt={serviceData.image.alt}
                    className="w-full max-w-md h-auto"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Hero Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Hero Section")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingHero(!editingHero)}
          >
            {editingHero ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingHero ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Service Name (English)")}</Label>
                  <Input
                    value={heroData.serviceName.en}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        serviceName: {
                          ...heroData.serviceName,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Service Name (Arabic)")}</Label>
                  <Input
                    value={heroData.serviceName.ar}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        serviceName: {
                          ...heroData.serviceName,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={heroData.title.en}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        title: { ...heroData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={heroData.title.ar}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        title: { ...heroData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>{t("Hero Images")}</Label>
                <MultiImageUploader
                  files={heroImageFiles}
                  setFiles={setHeroImageFiles}
                  previewUrls={heroData.images.map((img) =>
                    img.startsWith("http") ? img : `${baseUrl}${img}`
                  )}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t("Attributes")}</h4>
                  <Button
                    onClick={handleAddHeroAttribute}
                    size="sm"
                    className="gap-1"
                  >
                    <Icon icon="heroicons:plus" className="h-4 w-4" />
                    {t("Add Attribute")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {heroData.attr.map((attr, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Key (English)")}</Label>
                          <Input
                            value={attr.key.en}
                            onChange={(e) =>
                              handleHeroAttributeChange(
                                index,
                                "key",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Key (Arabic)")}</Label>
                          <Input
                            value={attr.key.ar}
                            onChange={(e) =>
                              handleHeroAttributeChange(
                                index,
                                "key",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Value (English)")}</Label>
                          <Input
                            value={attr.value.en}
                            onChange={(e) =>
                              handleHeroAttributeChange(
                                index,
                                "value",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Value (Arabic)")}</Label>
                          <Input
                            value={attr.value.ar}
                            onChange={(e) =>
                              handleHeroAttributeChange(
                                index,
                                "value",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveHeroAttribute(index)}
                        className="text-red-500"
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                        {t("Remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleUpdateHero}>{t("Save Changes")}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Service Name")}</h4>
                <p className="text-gray-600">
                  {lang === "en"
                    ? heroData.serviceName.en
                    : heroData.serviceName.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? heroData.title.en : heroData.title.ar}
                </p>
              </div>

              {heroData.images.length > 0 && (
                <div>
                  <h4 className="font-medium">{t("Images")}</h4>
                  <div className="flex flex-wrap gap-4">
                    {heroData.images.map((img, index) => (
                      <img
                        key={index}
                        src={
                          img.startsWith("http")
                            ? img
                            : `${baseUrl}${img.slice(1)}`
                        }
                        alt="Hero image"
                        className="w-32 h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              {heroData.attr.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t("Attributes")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroData.attr.map((attr, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium">
                          {lang === "en" ? attr.key.en : attr.key.ar}
                        </h5>
                        <p className="text-gray-600 mt-1">
                          {lang === "en" ? attr.value.en : attr.value.ar}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Partners Management")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Partners List */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("Current Partners")}
              </h3>
              {data?.partners?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 relative group"
                    >
                      {editingPartnerIndex === index ? (
                        <div className="space-y-3">
                          <div>
                            <Label>{t("Image")}</Label>
                            <ImageUploader
                              multiple={false}
                              file={imageFile}
                              setFile={handleImageChange}
                              previewUrl={
                                newPartner.url.startsWith("http")
                                  ? newPartner.url
                                  : `${baseUrl}${newPartner?.url.slice(1)}`
                              }
                            />
                          </div>
                          <div>
                            <Label>{t("Alt Text")}</Label>
                            <Input
                              value={newPartner.alt}
                              onChange={(e) =>
                                setNewPartner({
                                  ...newPartner,
                                  alt: e.target.value,
                                })
                              }
                              placeholder="Partner description"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSavePartner} size="sm">
                              {t("Save")}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingPartnerIndex(null)}
                              size="sm"
                            >
                              {t("Cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src={`${baseUrl}${partner.url.slice(1)}`}
                            alt={partner.alt}
                            className="w-full h-32 object-contain mb-2"
                          />
                          <p className="text-sm text-gray-600 truncate">
                            <strong>{t("Alt Text")}:</strong>{" "}
                            {partner.alt || "-"}
                          </p>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditPartner(index)}
                              className="h-8 w-8"
                            >
                              <Icon
                                icon="heroicons:pencil"
                                className="h-4 w-4"
                              />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemovePartner(index)}
                              className="h-8 w-8"
                            >
                              <Icon
                                icon="heroicons:trash"
                                className="h-4 w-4 text-red-500"
                              />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">{t("No partners added yet")}</p>
              )}
            </div>

            {/* Add New Partner */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                {isAddingPartner ? t("Add New Partner") : t("Add Partner")}
              </h3>

              {isAddingPartner ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label>{t("Image")}</Label>
                    <ImageUploader
                      file={imageFile}
                      multiple={false}
                      setFile={handleImageChange}
                    />
                  </div>
                  <div>
                    <Label>{t("Alt Text")}</Label>
                    <Input
                      value={newPartner.alt}
                      onChange={(e) =>
                        setNewPartner({ ...newPartner, alt: e.target.value })
                      }
                      placeholder="Partner description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddPartner}>
                      {t("Add Partner")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingPartner(false);
                        setNewPartner({ url: "", alt: "" });
                        setImageFile(null);
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAddingPartner(true)}
                  className="gap-2"
                >
                  <Icon icon="heroicons:plus" className="h-5 w-5" />
                  {t("Add New Partner")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Call to Action Section")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingCall(!editingCall)}
          >
            {editingCall ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingCall ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={callData.title.en}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        title: { ...callData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={callData.title.ar}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        title: { ...callData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Subtitle (English)")}</Label>
                  <Input
                    value={callData.subTitle.en}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        subTitle: { ...callData.subTitle, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Subtitle (Arabic)")}</Label>
                  <Input
                    value={callData.subTitle.ar}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        subTitle: { ...callData.subTitle, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Content (English)")}</Label>
                  <Input
                    value={callData.content.en}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        content: { ...callData.content, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Content (Arabic)")}</Label>
                  <Input
                    value={callData.content.ar}
                    onChange={(e) =>
                      setCallData({
                        ...callData,
                        content: { ...callData.content, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>{t("Image")}</Label>
                <ImageUploader
                  file={callImageFile}
                  setFile={setCallImageFile}
                  multiple={false}
                  previewUrl={
                    callData.image.url.startsWith("http")
                      ? callData.image.url
                      : `${baseUrl}${callData.image.url?.slice(1) || ""}`
                  }
                />
              </div>

              <div>
                <Label>{t("Image Alt Text")}</Label>
                <Input
                  value={callData.image.alt}
                  onChange={(e) =>
                    setCallData({
                      ...callData,
                      image: { ...callData.image, alt: e.target.value },
                    })
                  }
                />
              </div>

              <Button onClick={handleUpdateCall}>{t("Save Changes")}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? callData.title.en : callData.title.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Subtitle")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? callData.subTitle.en : callData.subTitle.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Content")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? callData.content.en : callData.content.ar}
                </p>
              </div>

              {callData.image.url && (
                <div>
                  <h4 className="font-medium">{t("Image")}</h4>
                  <img
                    src={
                      callData.image.url.startsWith("http")
                        ? callData.image.url
                        : `${baseUrl}${callData.image.url.slice(1)}`
                    }
                    alt={callData.image.alt}
                    className="w-full max-w-md h-auto"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>{" "}
      {/* FAQs Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("FAQs Section")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingFaqs(!editingFaqs)}
          >
            {editingFaqs ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingFaqs ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={faqsData.title.en}
                    onChange={(e) =>
                      setFaqsData({
                        ...faqsData,
                        title: { ...faqsData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={faqsData.title.ar}
                    onChange={(e) =>
                      setFaqsData({
                        ...faqsData,
                        title: { ...faqsData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Subtitle (English)")}</Label>
                  <Input
                    value={faqsData.subTitle.en}
                    onChange={(e) =>
                      setFaqsData({
                        ...faqsData,
                        subTitle: { ...faqsData.subTitle, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Subtitle (Arabic)")}</Label>
                  <Input
                    value={faqsData.subTitle.ar}
                    onChange={(e) =>
                      setFaqsData({
                        ...faqsData,
                        subTitle: { ...faqsData.subTitle, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t("FAQs")}</h4>
                  <Button onClick={handleAddFaq} size="sm" className="gap-1">
                    <Icon icon="heroicons:plus" className="h-4 w-4" />
                    {t("Add FAQ")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {faqsData.list.map((faq, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Question (English)")}</Label>
                          <Input
                            value={faq.question.en}
                            onChange={(e) =>
                              handleFaqChange(
                                index,
                                "question",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Question (Arabic)")}</Label>
                          <Input
                            value={faq.question.ar}
                            onChange={(e) =>
                              handleFaqChange(
                                index,
                                "question",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Answer (English)")}</Label>
                          <Input
                            value={faq.answer.en}
                            onChange={(e) =>
                              handleFaqChange(
                                index,
                                "answer",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Answer (Arabic)")}</Label>
                          <Input
                            value={faq.answer.ar}
                            onChange={(e) =>
                              handleFaqChange(
                                index,
                                "answer",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFaq(index)}
                        className="text-red-500"
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                        {t("Remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleUpdateFaqs}>{t("Save Changes")}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? faqsData.title.en : faqsData.title.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Subtitle")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? faqsData.subTitle.en : faqsData.subTitle.ar}
                </p>
              </div>

              {faqsData.list.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t("FAQs")}</h4>
                  <div className="space-y-3">
                    {faqsData.list.map((faq, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium">
                          {lang === "en" ? faq.question.en : faq.question.ar}
                        </h5>
                        <p className="text-gray-600 mt-1">
                          {lang === "en" ? faq.answer.en : faq.answer.ar}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Benefits Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Benefits Section")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingBenefits(!editingBenefits)}
          >
            {editingBenefits ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingBenefits ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={benefitsData.title.en}
                    onChange={(e) =>
                      setBenefitsData({
                        ...benefitsData,
                        title: { ...benefitsData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={benefitsData.title.ar}
                    onChange={(e) =>
                      setBenefitsData({
                        ...benefitsData,
                        title: { ...benefitsData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Subtitle (English)")}</Label>
                  <Input
                    value={benefitsData.subTitle.en}
                    onChange={(e) =>
                      setBenefitsData({
                        ...benefitsData,
                        subTitle: {
                          ...benefitsData.subTitle,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Subtitle (Arabic)")}</Label>
                  <Input
                    value={benefitsData.subTitle.ar}
                    onChange={(e) =>
                      setBenefitsData({
                        ...benefitsData,
                        subTitle: {
                          ...benefitsData.subTitle,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>{t("Image")}</Label>
                <ImageUploader
                  multiple={false}
                  file={benefitsImageFile}
                  setFile={setBenefitsImageFile}
                  previewUrl={
                    benefitsData.image.url.startsWith("http")
                      ? benefitsData.image.url
                      : `${baseUrl}${benefitsData.image.url?.slice(1) || ""}`
                  }
                />
              </div>

              <div>
                <Label>{t("Image Alt Text")}</Label>
                <Input
                  value={benefitsData.image.alt}
                  onChange={(e) =>
                    setBenefitsData({
                      ...benefitsData,
                      image: { ...benefitsData.image, alt: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t("Features")}</h4>
                  <Button
                    onClick={handleAddFeature}
                    size="sm"
                    className="gap-1"
                  >
                    <Icon icon="heroicons:plus" className="h-4 w-4" />
                    {t("Add Feature")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {benefitsData.feature.map((feature, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>{t("English")}</Label>
                          <Input
                            value={feature.en}
                            onChange={(e) =>
                              handleFeatureChange(index, "en", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Arabic")}</Label>
                          <Input
                            value={feature.ar}
                            onChange={(e) =>
                              handleFeatureChange(index, "ar", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500"
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                        {t("Remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleUpdateBenefits}>
                {t("Save Changes")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en"
                    ? benefitsData.title.en
                    : benefitsData.title.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Subtitle")}</h4>
                <p className="text-gray-600">
                  {lang === "en"
                    ? benefitsData.subTitle.en
                    : benefitsData.subTitle.ar}
                </p>
              </div>

              {benefitsData.image.url && (
                <div>
                  <h4 className="font-medium">{t("Image")}</h4>
                  <img
                    src={
                      benefitsData.image.url.startsWith("http")
                        ? benefitsData.image.url
                        : `${baseUrl}${benefitsData.image.url.slice(1)}`
                    }
                    alt={benefitsData.image.alt}
                    className="w-full max-w-md h-auto"
                  />
                </div>
              )}

              {benefitsData.feature.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t("Features")}</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {benefitsData.feature.map((feature, index) => (
                      <li key={index}>
                        {lang === "en" ? feature.en : feature.ar}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Impact Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("Impact Section")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => setEditingImpact(!editingImpact)}
          >
            {editingImpact ? t("Cancel") : t("Edit")}
          </Button>
        </CardHeader>
        <CardContent>
          {editingImpact ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Title (English)")}</Label>
                  <Input
                    value={impactData.title.en}
                    onChange={(e) =>
                      setImpactData({
                        ...impactData,
                        title: { ...impactData.title, en: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Title (Arabic)")}</Label>
                  <Input
                    value={impactData.title.ar}
                    onChange={(e) =>
                      setImpactData({
                        ...impactData,
                        title: { ...impactData.title, ar: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("Subtitle (English)")}</Label>
                  <Input
                    value={impactData.subTitle.en}
                    onChange={(e) =>
                      setImpactData({
                        ...impactData,
                        subTitle: {
                          ...impactData.subTitle,
                          en: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t("Subtitle (Arabic)")}</Label>
                  <Input
                    value={impactData.subTitle.ar}
                    onChange={(e) =>
                      setImpactData({
                        ...impactData,
                        subTitle: {
                          ...impactData.subTitle,
                          ar: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t("Statistics")}</h4>
                  <Button onClick={handleAddStat} size="sm" className="gap-1">
                    <Icon icon="heroicons:plus" className="h-4 w-4" />
                    {t("Add Statistic")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {impactData.statics.map((stat, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Name (English)")}</Label>
                          <Input
                            value={stat.name.en}
                            onChange={(e) =>
                              handleStatChange(
                                index,
                                "name",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Name (Arabic)")}</Label>
                          <Input
                            value={stat.name.ar}
                            onChange={(e) =>
                              handleStatChange(
                                index,
                                "name",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>{t("Count")}</Label>
                        <Input
                          value={stat.count}
                          onChange={(e) =>
                            handleStatChange(
                              index,
                              "count",
                              null,
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Description (English)")}</Label>
                          <Input
                            value={stat.desc.en}
                            onChange={(e) =>
                              handleStatChange(
                                index,
                                "desc",
                                "en",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label>{t("Description (Arabic)")}</Label>
                          <Input
                            value={stat.desc.ar}
                            onChange={(e) =>
                              handleStatChange(
                                index,
                                "desc",
                                "ar",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStat(index)}
                        className="text-red-500"
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                        {t("Remove")}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleUpdateImpact}>{t("Save Changes")}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{t("Title")}</h4>
                <p className="text-gray-600">
                  {lang === "en" ? impactData.title.en : impactData.title.ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium">{t("Subtitle")}</h4>
                <p className="text-gray-600">
                  {lang === "en"
                    ? impactData.subTitle.en
                    : impactData.subTitle.ar}
                </p>
              </div>

              {impactData.statics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t("Statistics")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {impactData.statics.map((stat, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="text-2xl font-bold text-primary">
                          {stat.count}
                        </h5>
                        <h6 className="font-medium">
                          {lang === "en" ? stat.name.en : stat.name.ar}
                        </h6>
                        <p className="text-gray-600 mt-1">
                          {lang === "en" ? stat.desc.en : stat.desc.ar}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
