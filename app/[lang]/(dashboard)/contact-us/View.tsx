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
    className="flex flex-col sm:flex-row sm:gap-6 sm:items-start py-3 border-b border-gray-200 last:border-b-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-sm text-default-900 font-medium sm:w-[35%] mb-1 sm:mb-0 flex-shrink-0">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold sm:w-[65%] break-words">
      {value || "-"}
    </span>
  </motion.li>
);

// Special component for long messages
const MessageItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <motion.div
    className="py-3 border-b border-gray-200 last:border-b-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex flex-col gap-2">
      <span className="text-sm text-default-900 font-medium">{label}:</span>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
        <pre className="text-default-500 dark:text-white font-medium whitespace-pre-wrap text-sm leading-6">
          {value || "-"}
        </pre>
      </div>
    </div>
  </motion.div>
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

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString("en-GB");
      } catch {
        return "-";
      }
    };

    return (
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
            {t("Contact Information")}
          </h3>
          <ul className="space-y-0">
            <DetailItem label={t("ID")} value={contactData.id} />
            <DetailItem label={t("Name")} value={contactData.name} />
            <DetailItem label={t("Email")} value={contactData.email} />
            <DetailItem label={t("Phone")} value={contactData.phone} />
            {contactData.address && (
              <DetailItem label={t("Address")} value={contactData.address} />
            )}

            <DetailItem
              label={t("Date Received")}
              value={formatDate(contactData.created_at)}
            />
          </ul>
        </div>

        {/* Message Section - Only show if there's a message */}
        {contactData.message && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
              {t("Message Details")}
            </h3>
            <MessageItem label={t("Message")} value={contactData.message} />
          </div>
        )}

        {/* Additional Information for specific types */}
        {(contactData.offers_name || contactData.offers_price) && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
              {t("Additional Information")}
            </h3>
            <ul className="space-y-0">
              {contactData.offers_name && (
                <DetailItem
                  label={t("Offer Name")}
                  value={contactData.offers_name}
                />
              )}
              {contactData.offers_price && (
                <DetailItem
                  label={t("Offer Price")}
                  value={`${contactData.offers_price} ${t("SAR")}`}
                />
              )}
            </ul>
          </div>
        )}

        {/* Career File Section */}
        {contactData.career_file && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
              {t("Attached File")}
            </h3>
            <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon
                icon="heroicons:document"
                className="h-6 w-6 text-blue-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {contactData.career_file.split("/").pop()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("Click to download the file")}
                </p>
              </div>
              <a
                href={`${ImageUrl}${contactData.career_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Icon icon="heroicons:arrow-down-tray" className="h-4 w-4" />
                {t("Download")}
              </a>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-default-900 border-b pb-2">
            {t("System Information")}
          </h3>
          <ul className="space-y-0">
            <DetailItem
              label={t("Created At")}
              value={formatDate(contactData.created_at)}
            />
            <DetailItem
              label={t("Updated At")}
              value={formatDate(contactData.updated_at)}
            />
          </ul>
        </div>
      </div>
    );
  };

  const getSheetTitle = () => {
    const contactData = row?.original;
    if (!contactData) return t("Contact Details");

    switch (contactData.type) {
      case "offers":
        return t("Contact Us Offer Details");
      case "career":
        return t("Contact Us Career Details");
      case "general":
        return t("General Contact Inquiry");
      default:
        return t("Contact Us User Message Details");
    }
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
            {getSheetTitle()}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] mt-4">
          <div className="py-2 px-1">{renderData()}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
