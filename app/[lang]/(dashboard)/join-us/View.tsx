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
import { motion } from "framer-motion";
import { ImageUrl } from "@/services/app.config";

// A reusable component to display a list of details
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <motion.li
    className="flex flex-col sm:flex-row sm:gap-6 sm:items-center py-2 border-b border-gray-200 last:border-b-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-sm text-default-900 font-medium sm:w-[40%] mb-1 sm:mb-0">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold sm:w-[55%] break-words">
      {value || "-"}
    </span>
  </motion.li>
);

interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  const renderData = () => {
    const contactData = row?.original;

    if (!contactData) {
      return (
        <div className="text-center py-8 text-gray-500">
          {t("No data available")}
        </div>
      );
    }

    const getSheetTitle = () => {
      switch (contactData.type) {
        case "offers":
          return t("Contact Us Offer Details");
        case "career":
          return t("Contact Us Career Details");
        default:
          return t("Contact Us User Message Details");
      }
    };

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString("en-GB");
      } catch {
        return "-";
      }
    };

    return (
      <div className="space-y-4">
        {/* Common Fields */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
            {t("Basic Information")}
          </h3>
          <ul className="space-y-2">
            <DetailItem label={t("ID")} value={contactData.id} />
            <DetailItem label={t("Name")} value={contactData.name} />
            <DetailItem label={t("Email")} value={contactData.email} />
            <DetailItem label={t("Phone")} value={contactData.phone} />
            <DetailItem label={t("Address")} value={contactData.address} />
            {contactData.message && (
              <DetailItem label={t("Message")} value={contactData.message} />
            )}
            <DetailItem
              label={t("Date Of Send Message")}
              value={formatDate(contactData.created_at)}
            />
          </ul>
        </div>

        {/* Type-specific Fields */}
        {contactData.type === "career" && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
              {t("Career Information")}
            </h3>
            <ul className="space-y-2">
              {contactData.offers_name && (
                <DetailItem
                  label={t("Position")}
                  value={contactData.offers_name}
                />
              )}
              {contactData.offers_price && (
                <DetailItem
                  label={t("Expected Salary")}
                  value={contactData.offers_price}
                />
              )}
              {contactData.career_file && (
                <li className="flex flex-col sm:flex-row sm:gap-6 sm:items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-default-900 font-medium sm:w-[40%] mb-1 sm:mb-0">
                    {t("Resume")}:
                  </span>
                  <div className="sm:w-[55%]">
                    <a
                      href={`${ImageUrl}${contactData.career_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Icon
                        icon="heroicons:document-arrow-down"
                        className="h-4 w-4"
                      />
                      {t("Download Resume")}
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        {contactData.type === "offers" && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
              {t("Offer Information")}
            </h3>
            <ul className="space-y-2">
              <DetailItem
                label={t("Offer Name")}
                value={contactData.offers_name}
              />
              <DetailItem
                label={t("Offer Price")}
                value={`${contactData.offers_price} ${t("SAR")}`}
              />
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Button size="icon" variant="outline" className="h-7 w-7" disabled>
        <Icon icon="heroicons:eye" className="h-4 w-4" />
      </Button>
    );
  }

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
        className="max-w-[736px] w-full sm:max-w-[90vw] md:max-w-[736px]"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold">
            {row?.original
              ? (() => {
                  switch (row.original.type) {
                    case "offers":
                      return t("Contact Us Offer Details");
                    case "career":
                      return t("Contact Us Career Details");
                    default:
                      return t("Contact Us User Message Details");
                  }
                })()
              : t("Contact Details")}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          <div className="py-2 px-1">{renderData()}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
