"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { faker } from "@faker-js/faker";

import BasicInfo from "./BasicInfo/page";
import MetaInfo from "./MetaInfo/page";
import HeroSection from "./HeroSection/page";
import PartnersSection from "./PartnersSection/page";
import BenefitsSection from "./BenefitsSection/page";
import ImpactSection from "./ImpactSection/page";
import FaqsSection from "./FaqsSection/page";
import CallToActionSection from "./CallToActionSection/page";

import { useTranslate } from "@/config/useTranslation";
import { Auth } from "@/components/auth/Auth";
import { CreateServices } from "@/services/service/service";

interface ServiceData {
  slug: string;
  title: { en: string; ar: string };
  subTitle: { en: string; ar: string };
  image: { url: string; alt: string };
  meta: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    structuredData: Record<string, any>;
    headScript: string;
    bodyScript: string;
  };
  hero: {
    serviceName: { en: string; ar: string };
    title: { en: string; ar: string };
    images: string[];
    attr: Array<{
      key: { en: string; ar: string };
      value: { en: string; ar: string };
    }>;
  };
  partners: Array<{
    url: string;
    alt: string;
  }>;
  benefits: {
    title: { en: string; ar: string };
    subTitle: { en: string; ar: string };
    feature: Array<{ en: string; ar: string }>;
    image: { url: string; alt: string };
  };
  impact: {
    title: { en: string; ar: string };
    subTitle: { en: string; ar: string };
    statics: Array<{
      name: { en: string; ar: string };
      count: string;
      desc: { en: string; ar: string };
    }>;
  };
  faqs: {
    title: { en: string; ar: string };
    subTitle: { en: string; ar: string };
    list: Array<{
      question: { en: string; ar: string };
      answer: { en: string; ar: string };
    }>;
  };
  call: {
    title: { en: string; ar: string };
    subTitle: { en: string; ar: string };
    content: { en: string; ar: string };
    image: { url: string; alt: string };
  };
}

const ServiceBuilderPage = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { t } = useTranslate();
  const { lang } = useParams();

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<ServiceData>({
    slug: "",
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    image: { url: "", alt: "" },
    meta: {
      title: "",
      description: "",
      keywords: [],
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogUrl: "",
      ogType: "website",
      structuredData: {},
      headScript: "",
      bodyScript: "",
    },
    hero: {
      serviceName: { en: "", ar: "" },
      title: { en: "", ar: "" },
      images: [],
      attr: [],
    },
    partners: [],
    benefits: {
      title: { en: "", ar: "" },
      subTitle: { en: "", ar: "" },
      feature: [],
      image: { url: "", alt: "" },
    },
    impact: {
      title: { en: "", ar: "" },
      subTitle: { en: "", ar: "" },
      statics: [],
    },
    faqs: {
      title: { en: "", ar: "" },
      subTitle: { en: "", ar: "" },
      list: [],
    },
    call: {
      title: { en: "", ar: "" },
      subTitle: { en: "", ar: "" },
      content: { en: "", ar: "" },
      image: { url: "", alt: "" },
    },
  });
  console.log(service);
  const steps = [
    "Basic Info",
    "SEO & Meta",
    "Hero Section",
    "Partners",
    "Benefits",
    "Impact Stats",
    "FAQs",
    "Call to Action",
  ];

  const isStepOptional = (step: number) => step > 3; // Make steps after "Partners" optional

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateCurrentStep = (): boolean => {
    switch (activeStep) {
      case 0: // Basic Info
        if (!service.slug || !service.title.en || !service.title.ar) {
          toast({
            title: "Validation Error",
            description:
              "Please fill in all required basic information fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 1: // Meta Info
        if (!service.meta.title || !service.meta.description) {
          toast({
            title: "Validation Error",
            description: "Please fill in meta title and description.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2: // Hero Section
        if (!service.hero.serviceName.en || !service.hero.title.en) {
          toast({
            title: "Validation Error",
            description: "Please fill in hero section required fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await CreateServices(service, lang); // Send service data to backend

      toast({
        title: "Service Saved Successfully!",
        description: "Your service configuration has been saved.",
      });

      // Optionally redirect or reset form
      // router.push('/services');
    } catch (error) {
      console.error("Save service error:", error);
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfo
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 1:
        return (
          <MetaInfo
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 2:
        return (
          <HeroSection
            service={service.hero}
            setService={(updateFunction) => {
              setService((prev) => ({
                ...prev,
                hero:
                  typeof updateFunction === "function"
                    ? updateFunction(prev.hero)
                    : updateFunction,
              }));
            }}
            lang={lang as "en" | "ar"}
          />
        );
      case 3:
        return (
          <PartnersSection
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 4:
        return (
          <BenefitsSection
            benefits={service.benefits}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      case 5:
        return (
          <ImpactSection
            impact={service.impact}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      case 6:
        return (
          <FaqsSection
            faqs={service.faqs}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      case 7:
        return (
          <CallToActionSection
            call={service.call}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      default:
        return (
          <BasicInfo
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-2 ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("Create New Service")}</h1>
        <p className="text-gray-600">
          {t("Build your service configuration step by step")}
        </p>
      </div>

      <div className="mt-4">
        <Stepper
          current={activeStep}
          direction={isTablet ? "vertical" : "horizontal"}
        >
          {steps.map((label, index) => {
            const stepProps: any = {};
            const labelProps: any = {};
            if (isStepOptional(index)) {
              labelProps.optional = <StepLabel>{t("Optional")}</StepLabel>;
            }
            return (
              <Step key={faker.string.uuid()} {...stepProps}>
                <StepLabel {...labelProps}>{t(label)}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <div className="mt-8 mb-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                {t("All steps completed")}
              </h2>
              <p className="text-green-600 mb-4">
                {t("Review your service configuration and save when ready")}
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? t("Creating") : t("Create Service")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 mb-8">
              <div className="bg-white rounded-lg border p-6">
                {renderStepContent()}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0}
                className={activeStep === 0 ? "invisible" : ""}
              >
                {t("Back")}
              </Button>

              <div className="flex gap-2">
                <Button onClick={handleNext} disabled={loading}>
                  {activeStep === steps.length - 1 ? t("Review") : t("Next")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProtectedComponent = Auth()(ServiceBuilderPage);
export default ProtectedComponent;

// {slug: "gdfgdfgdfg", title: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"},…}
// benefits : {title: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}, subTitle: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"},…}
//
// image : {url: "/uploads/54545-ef8326298410971d839d9a2e4ad5aa58c.png", alt: "gdfgdfgdfggdfgdfgdfg"}
// subTitle : {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}
// title : {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}
// call : {title: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}, subTitle: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"},…}
// faqs : {title: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}, subTitle: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"},…}
// hero :{serviceName: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"}, title: {en: "gdfgdfgdfg", ar: "gdfgdfgdfg"},…}
// image : {url: "/uploads/54545-54107ae333103310269f9cb910188a853747.png", alt: "54545"}
// meta : {title: "gdfgdfgdfg", description: "gdfgdfgdfg", keywords: ["gdfgdfgdfg", "fsdfsdf"],…}
