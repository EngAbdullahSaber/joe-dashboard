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

// A reusable component to display a list of details
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <motion.li
    className="flex flex-row gap-6 items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-sm text-default-900 font-medium w-[40%]">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold w-[55%]">
      {value}
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
    const lawyerData = row?.original;

    return (
      <>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("Id")} value={lawyerData?.id || "-"} />
          <DetailItem label={t("name")} value={lawyerData?.name || "-"} />
          <DetailItem label={t("email")} value={lawyerData?.email || "-"} />
          <DetailItem label={t("address")} value={lawyerData?.address || "-"} />
          <DetailItem label={t("phone")} value={lawyerData?.phone || "-"} />
          <DetailItem label={t("message")} value={lawyerData?.message || "-"} />
          {lawyerData?.type == "career" ? (
            <li className="flex flex-row gap-6 items-center">
              <span className="text-sm text-default-900 font-medium w-[40%]">
                {t("career file")}:
              </span>
              <a
                href={lawyerData?.career_file}
                className="text-default-500 dark:text-white font-semibold w-[55%]"
              >
                {t("Show File")}
              </a>
            </li>
          ) : null}
          {lawyerData?.type == "offers" ? (
            <DetailItem
              label={t("offers name")}
              value={lawyerData?.offers_name || "-"}
            />
          ) : null}
          {lawyerData?.type == "offers" ? (
            <DetailItem
              label={t("offers price")}
              value={lawyerData?.offers_price || "-"}
            />
          ) : null}
          {lawyerData?.type == "offers" ? (
            <DetailItem
              label={t("offers price")}
              value={lawyerData?.offers_price || "-"}
            />
          ) : null}

          <DetailItem
            label={t("Date Of Send Message")}
            value={
              new Date(lawyerData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
        </ul>
      </>
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
          <SheetTitle>
            {row?.original.type == "offers"
              ? t("Contact Us Offer Details")
              : row?.original.type == "career"
              ? t("Contact Us Career Details")
              : t("Contact Us User Message Details")}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">{renderData()}</div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
