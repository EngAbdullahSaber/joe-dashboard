"use client";
import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { faker } from "@faker-js/faker";

import BasicInfo, { BasicInfoRef } from "./BasicInfo/page";
import MetaInfo, { MetaInfoRef } from "./MetaInfo/page";
import HeroSection, { HeroSectionRef } from "./HeroSection/page";
import PartnersSection, { PartnersSectionRef } from "./PartnersSection/page";
import BenefitsSection, { BenefitsSectionRef } from "./BenefitsSection/page";
import ImpactSection, { ImpactSectionRef } from "./ImpactSection/page";
import FaqsSection, { FaqsSectionRef } from "./FaqsSection/page";
import CallToActionSection, {
  CallToActionRef,
} from "./CallToActionSection/page";

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

  // Refs for each step component that needs validation
  const basicInfoRef = useRef<BasicInfoRef>(null);
  const metaInfoRef = useRef<MetaInfoRef>(null);
  const heroSectionRef = useRef<HeroSectionRef>(null);
  const partnerSectionRef = useRef<PartnersSectionRef>(null);
  const benefitSectionRef = useRef<BenefitsSectionRef>(null);
  const impactSectionRef = useRef<ImpactSectionRef>(null);
  const faqsSectionRef = useRef<FaqsSectionRef>(null);
  const callToActionRef = useRef<CallToActionRef>(null);

  // Add other refs as needed for other steps
  // const metaInfoRef = useRef<MetaInfoRef>(null);
  // const heroSectionRef = useRef<HeroSectionRef>(null);

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

  const handleNext = async () => {
    // Validate current step before proceeding
    const isValid = await validateCurrentStep();
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const validateCurrentStep = async (): Promise<boolean> => {
    switch (activeStep) {
      case 0: // Basic Info
        if (basicInfoRef.current) {
          const isValid = await basicInfoRef.current.validateForm();
          const isUploading = basicInfoRef.current.getUploadStatus?.() || false;

          if (!isValid || isUploading) {
            return false;
          }
        }
        break;

      case 1: // Meta Info
        if (metaInfoRef.current) {
          const isValid = await metaInfoRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;

      case 2: // Hero Section
        // Add validation for HeroSection if needed
        if (heroSectionRef.current) {
          const isValid = await heroSectionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;
      case 3: // Hero Section
        // Add validation for HeroSection if needed
        if (partnerSectionRef.current) {
          const isValid = await partnerSectionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;
      case 4: // Hero Section
        // Add validation for HeroSection if needed
        if (benefitSectionRef.current) {
          const isValid = await benefitSectionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;
      case 5: // Hero Section
        // Add validation for HeroSection if needed
        if (impactSectionRef.current) {
          const isValid = await impactSectionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;
      case 6: // Hero Section
        // Add validation for HeroSection if needed
        if (faqsSectionRef.current) {
          const isValid = await faqsSectionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
        }
        break;
      case 7: // Hero Section
        // Add validation for HeroSection if needed
        if (callToActionRef.current) {
          const isValid = await callToActionRef.current.validateForm();
          if (!isValid) {
            return false;
          }
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
      const response = await CreateServices(service, lang);

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
            ref={basicInfoRef}
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 1:
        return (
          <MetaInfo
            ref={metaInfoRef}
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 2:
        return (
          <HeroSection
            ref={heroSectionRef}
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
            ref={partnerSectionRef}
            setService={setService}
            service={service}
            lang={lang as "en" | "ar"}
          />
        );
      case 4:
        return (
          <BenefitsSection
            benefits={service.benefits}
            ref={benefitSectionRef}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      case 5:
        return (
          <ImpactSection
            ref={impactSectionRef}
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
            lang={lang}
            ref={faqsSectionRef}
          />
        );
      case 7:
        return (
          <CallToActionSection
            ref={callToActionRef}
            call={service.call}
            setService={setService}
            lang={lang as "en" | "ar"}
          />
        );
      default:
        return (
          <BasicInfo
            ref={basicInfoRef}
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
