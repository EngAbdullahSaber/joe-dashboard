"use client";

import React from "react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Flatpickr from "react-flatpickr";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import RadioRight from "../(user-mangement)/shared/RadioRight ";
import FileUploadWithButton from "../(user-mangement)/shared/fileupload-with-button";
import BasicSelect from "../(user-mangement)/shared/basic-select";
const CreateMerchindizer = ({ t }: { t: any }) => {
  const [picker, setPicker] = useState<Date>(new Date());
  const { lang } = useParams();
  return (
    <>
      <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
        {" "}
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              {" "}
              <Icon icon="mingcute:user-add-2-fill" />
              {t("UserManagment.merchandiser.Create Marchindaizer")}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={lang === "ar" ? "left" : "right"}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="max-w-lg p-5 overflow-y-scroll"
          >
            <SheetHeader className="py-3 pl-3.5">
              <SheetTitle>
                {t("UserManagment.merchandiser.Create a New Marchindaizer")}
              </SheetTitle>
            </SheetHeader>
            <hr />

            <div className="flex flex-col gap-5 ">
              <div className="flex flex-row mt-5 justify-between w-full gap-[10px]  mx-auto  items-center">
                <div className="flex flex-col gap-2 w-full">
                  <Label> {t("UserManagment.merchandiser.Name")}</Label>
                  <Input
                    type="text"
                    placeholder={t(
                      "UserManagment.merchandiser.Enter Marchindaizer name"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label> {t("UserManagment.merchandiser.Phone Number")}</Label>
                  <Input
                    type="number"
                    placeholder={t(
                      "UserManagment.merchandiser.Enter Phone Number"
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between w-full gap-[10px]  mx-auto  items-center">
                <div className="flex flex-col gap-2 w-full">
                  <Label>{t("UserManagment.merchandiser.Retailer")}</Label>
                  <BasicSelect />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label>{t("UserManagment.merchandiser.Stores")}</Label>
                  <BasicSelect />
                </div>
              </div>
              <div className="flex flex-row justify-between w-full gap-[10px]  mx-auto  items-center">
                <div className="flex flex-col gap-2 w-full">
                  <Label> {t("UserManagment.merchandiser.Email")}</Label>
                  <Input
                    type="email"
                    placeholder={t("UserManagment.merchandiser.Enter Email")}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label> {t("UserManagment.merchandiser.Address")} </Label>
                  <Input
                    type="text"
                    placeholder={t("UserManagment.merchandiser.Enter Address")}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between w-full gap-[10px]  mx-auto  items-center">
                <div className="flex flex-col gap-2 w-full">
                  <Label> {t("UserManagment.merchandiser.Mac Id")}</Label>
                  <Input
                    type="number"
                    placeholder={t("UserManagment.merchandiser.Enter Mac Id")}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label>{t("UserManagment.merchandiser.Date of birth")}</Label>
                  <Flatpickr
                    className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                    placeholder={t("UserManagment.merchandiser.Date of birth")}
                    value={picker}
                    onChange={(dates: Date[]) => {
                      setPicker(dates[0] || null);
                    }}
                    id="default-picker"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between  w-[80%] mx-auto  items-center">
                <div className="flex flex-col gap-2">
                  <FileUploadWithButton />
                </div>
                <div className="flex flex-col gap-2">
                  <RadioRight
                    text1={t("UserManagment.merchandiser.Male")}
                    text2={t("UserManagment.merchandiser.Female")}
                  />{" "}
                </div>
              </div>
              <div className="flex flex-row justify-between  w-[95%] mx-auto  items-center">
                <div className="flex flex-col  ">
                  <RadioRight
                    text1={t("UserManagment.merchandiser.In Vacation")}
                    text2={t("UserManagment.merchandiser.Working")}
                  />{" "}
                </div>
                <div className="flex flex-col  ">
                  <RadioRight
                    text1={t("UserManagment.merchandiser.Active")}
                    text2={t("UserManagment.merchandiser.Not Active")}
                  />{" "}
                </div>
              </div>
              <div className=" flex justify-center gap-3 mt-4 w-[90%] mx-auto">
                <SheetClose asChild>
                  <Button type="button" className="w-full" variant="outline">
                    {t("UserManagment.merchandiser.Cancel")}
                  </Button>
                </SheetClose>
                <Button type="button" className="w-full">
                  <Button type="button" className="w-full">
                    {t("UserManagment.merchandiser.Create Marchindaizer")}
                  </Button>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default CreateMerchindizer;
