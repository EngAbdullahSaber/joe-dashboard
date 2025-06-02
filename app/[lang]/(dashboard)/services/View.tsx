"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { baseUrl } from "@/services/app.config";

// A reusable component to display a list of details
const DetailItem: React.FC<{
  label: string;
  value: string | number | React.ReactNode;
}> = ({ label, value }) => (
  <li className="flex flex-row gap-6 items-center">
    <span className="text-sm text-default-900 font-medium w-[40%]">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold w-[55%]">
      {value}
    </span>
  </li>
);

interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t } = useTranslate();
  const { lang } = useParams();

  const renderData = () => {
    const serviceData = row?.original;

    const renderLocalizedField = (field: any) => {
      if (!field) return "-";
      return lang === "en" ? field?.en : field?.ar || "-";
    };

    const renderImage = (url: string, alt: string, className = "w-14 h-14") => {
      return (
        <Avatar className={className}>
          <AvatarImage
            className={className}
            src={`${baseUrl}${url.slice(1)}`}
          />
          <AvatarFallback>image</AvatarFallback>
        </Avatar>
      );
    };

    const renderList = (items: any[]) => {
      return (
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index}>{renderLocalizedField(item)}</li>
          ))}
        </ul>
      );
    };

    const renderHeroAttributes = () => {
      if (!serviceData?.hero?.attr) return "-";

      return (
        <ul className="space-y-2">
          {serviceData.hero.attr.map((attr: any, index: number) => (
            <li key={index}>
              <strong>{renderLocalizedField(attr.key)}:</strong>{" "}
              {renderLocalizedField(attr.value)}
            </li>
          ))}
        </ul>
      );
    };

    const renderPartners = () => {
      if (!serviceData?.partners) return "-";

      return (
        <div className="flex flex-wrap gap-4">
          {serviceData.partners.map((partner: any, index: number) => (
            <div key={index}>
              {renderImage(partner.url, partner.alt, "w-20 h-20")}
              <p className="text-xs mt-1">{partner.alt}</p>
            </div>
          ))}
        </div>
      );
    };

    const renderStatistics = () => {
      if (!serviceData?.impact?.statics) return "-";

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceData.impact.statics.map((stat: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <h4 className="font-bold text-lg">{stat.count}</h4>
              <h5 className="font-semibold">
                {renderLocalizedField(stat.name)}
              </h5>
              <p className="text-sm mt-2">{renderLocalizedField(stat.desc)}</p>
            </div>
          ))}
        </div>
      );
    };

    const renderFAQs = () => {
      if (!serviceData?.faqs?.list) return "-";

      return (
        <div className="space-y-4">
          {serviceData.faqs.list.map((faq: any, index: number) => (
            <div key={index} className="border-b pb-4">
              <h4 className="font-semibold">
                {renderLocalizedField(faq.question)}
              </h4>
              <p className="mt-2">{renderLocalizedField(faq.answer)}</p>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="font-semibold text-lg">{t("Basic Information")}</h3>
          <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
            <DetailItem label={t("ID")} value={serviceData?.id || "-"} />
            <DetailItem label={t("Slug")} value={serviceData?.slug || "-"} />
            <DetailItem
              label={t("Title")}
              value={renderLocalizedField(serviceData?.title)}
            />
            <DetailItem
              label={t("Subtitle")}
              value={renderLocalizedField(serviceData?.subTitle)}
            />
            <DetailItem
              label={t("Main Image")}
              value={
                serviceData?.image?.url
                  ? renderImage(serviceData.image.url, serviceData.image.alt)
                  : "-"
              }
            />
            <DetailItem
              label={t("Image Alt")}
              value={serviceData?.image?.alt || "-"}
            />
            <DetailItem
              label={t("Created At")}
              value={
                new Date(serviceData?.created_at).toLocaleDateString("en-GB") ||
                "-"
              }
            />
            <DetailItem
              label={t("Updated At")}
              value={
                new Date(serviceData?.updated_at).toLocaleDateString("en-GB") ||
                "-"
              }
            />
          </ul>
        </div>

        {/* Hero Section */}
        <div>
          <h3 className="font-semibold text-lg">{t("Hero Section")}</h3>
          <ul className="!mt-5 space-y-4">
            <DetailItem
              label={t("Hero Title")}
              value={renderLocalizedField(serviceData?.hero?.title)}
            />
            <DetailItem
              label={t("Service Name")}
              value={renderLocalizedField(serviceData?.hero?.serviceName)}
            />
            <DetailItem
              label={t("Attributes")}
              value={renderHeroAttributes()}
            />
            <DetailItem
              label={t("Hero Images")}
              value={
                serviceData?.hero?.images ? (
                  <div className="flex flex-wrap gap-4">
                    {serviceData.hero.images.map(
                      (img: string, index: number) => (
                        <div key={index}>
                          {renderImage(
                            img,
                            "Hero image " + (index + 1),
                            "w-20 h-20"
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  "-"
                )
              }
            />
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h3 className="font-semibold text-lg">{t("Partners")}</h3>
          <div className="!mt-5">
            <DetailItem label={t("Partner Logos")} value={renderPartners()} />
          </div>
        </div>

        {/* Benefits */}
        {serviceData?.benefits && (
          <div>
            <h3 className="font-semibold text-lg">{t("Benefits")}</h3>
            <ul className="!mt-5 space-y-4">
              <DetailItem
                label={t("Title")}
                value={renderLocalizedField(serviceData.benefits.title)}
              />
              <DetailItem
                label={t("Subtitle")}
                value={renderLocalizedField(serviceData.benefits.subTitle)}
              />
              <DetailItem
                label={t("Image")}
                value={
                  serviceData.benefits.image?.url
                    ? renderImage(
                        serviceData.benefits.image.url,
                        serviceData.benefits.image.alt
                      )
                    : "-"
                }
              />
              <DetailItem
                label={t("Features")}
                value={
                  serviceData.benefits.feature
                    ? renderList(serviceData.benefits.feature)
                    : "-"
                }
              />
            </ul>
          </div>
        )}

        {/* Impact */}
        {serviceData?.impact && (
          <div>
            <h3 className="font-semibold text-lg">{t("Impact")}</h3>
            <ul className="!mt-5 space-y-4">
              <DetailItem
                label={t("Title")}
                value={renderLocalizedField(serviceData.impact.title)}
              />
              <DetailItem
                label={t("Subtitle")}
                value={renderLocalizedField(serviceData.impact.subTitle)}
              />
              <DetailItem label={t("Statistics")} value={renderStatistics()} />
            </ul>
          </div>
        )}

        {/* FAQs */}
        {serviceData?.faqs && (
          <div>
            <h3 className="font-semibold text-lg">{t("FAQs")}</h3>
            <ul className="!mt-5 space-y-4">
              <DetailItem
                label={t("Title")}
                value={renderLocalizedField(serviceData.faqs.title)}
              />
              <DetailItem
                label={t("Subtitle")}
                value={renderLocalizedField(serviceData.faqs.subTitle)}
              />
              <DetailItem
                label={t("Questions & Answers")}
                value={renderFAQs()}
              />
            </ul>
          </div>
        )}

        {/* Call to Action */}
        {serviceData?.call && (
          <div>
            <h3 className="font-semibold text-lg">{t("Call to Action")}</h3>
            <ul className="!mt-5 space-y-4">
              <DetailItem
                label={t("Title")}
                value={renderLocalizedField(serviceData.call.title)}
              />
              <DetailItem
                label={t("Content")}
                value={renderLocalizedField(serviceData.call.content)}
              />
              <DetailItem
                label={t("Subtitle")}
                value={renderLocalizedField(serviceData.call.subTitle)}
              />
              <DetailItem
                label={t("Image")}
                value={
                  serviceData.call.image?.url
                    ? renderImage(
                        serviceData.call.image.url,
                        serviceData.call.image.alt
                      )
                    : "-"
                }
              />
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          color="secondary"
        >
          <Icon icon="heroicons:eye" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="max-w-[736px]"
      >
        <SheetHeader>
          <SheetTitle>{t("Service Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">{renderData()}</div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("Close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
