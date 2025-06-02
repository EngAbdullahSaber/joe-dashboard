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

// A reusable component to display a list of details
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
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
    const lawyerData = row?.original;

    return (
      <>
        <h3 className="font-semibold text-lg">{t("Blog Info")}</h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("Id")} value={lawyerData?.id || "-"} />
          <DetailItem
            label={t("name")}
            value={
              lang == "en" ? lawyerData?.name?.en : lawyerData?.name?.ar || "-"
            }
          />
          <DetailItem label={t("price")} value={lawyerData?.price || "-"} />
          <DetailItem
            label={t("Price After Offers")}
            value={lawyerData?.priceAfterOffers || "-"}
          />
          <DetailItem
            label={t("department")}
            value={lawyerData?.department_id || "-"}
          />

          <DetailItem
            label={t("meta title")}
            value={
              lang == "en"
                ? lawyerData?.meta_title?.en
                : lawyerData?.meta_title?.ar || "-"
            }
          />
          <DetailItem
            label={t("meta description")}
            value={
              lang == "en"
                ? lawyerData?.meta_description?.en
                : lawyerData?.meta_description?.ar || "-"
            }
          />
          <DetailItem
            label={t("meta keywords")}
            value={
              lang == "en"
                ? lawyerData?.meta_keywords?.en
                : lawyerData?.meta_keywords?.ar || "-"
            }
          />
          <li className="flex flex-row gap-6 items-center">
            <span className="text-sm text-default-900 font-medium w-[40%]">
              {t("Image")}:
            </span>
            <span className="text-default-500 dark:text-white font-semibold w-[55%]">
              <Avatar className="w-14 h-14">
                <AvatarImage
                  className="w-14 h-14"
                  src={`${lawyerData.image_url}`}
                />
                <AvatarFallback>image</AvatarFallback>
              </Avatar>{" "}
            </span>
          </li>
          <DetailItem
            label={t("Image Alternative")}
            value={lawyerData?.image_alt || "-"}
          />

          <DetailItem
            label={t("Date Of Create Career")}
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
          <SheetTitle>{t("Blog Details")}</SheetTitle>
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
