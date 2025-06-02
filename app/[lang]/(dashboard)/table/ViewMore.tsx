"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const ViewMore = () => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
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
          <SheetTitle>{t("UserManagment.user.User Details")}</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.User Name")} :
              </span>{" "}
              <span className="text-default-500 "> Ahmed</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Role")} :
              </span>
              <span className="text-default-500 "> Admin</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Mac Id")} :
              </span>{" "}
              <span className="text-default-500 "> 9h-7f-6k</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Email")} :
              </span>{" "}
              <span className="text-default-500 ">
                {" "}
                prantik@codeshaper.tech
              </span>
            </li>
          </ul>
          <hr className="my-8" />
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Phone")} :
              </span>{" "}
              <span className="text-default-500 "> 011223344556</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Address")} :{" "}
              </span>{" "}
              <span className="text-warning"> Egypt , Cairo</span>
            </li>
            <li className="col-span-2">
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Birth Date")} :{" "}
              </span>{" "}
              <span className="text-default-500 "> 12/03/2004</span>
            </li>
          </ul>
          <hr className="my-8" />
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Gender")} :{" "}
              </span>{" "}
              <span className="text-default-500 "> Male</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Activation")} :{" "}
              </span>
              <span className="text-default-500 ">Active</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Vacation")} :{" "}
              </span>{" "}
              <span className="text-default-500 "> In Vacation</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("UserManagment.user.Created")} :
              </span>{" "}
              <span className="text-warning"> 12/03/2004</span>
            </li>
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
