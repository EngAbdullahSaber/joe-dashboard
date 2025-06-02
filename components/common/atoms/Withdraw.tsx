import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import BasicSelect from "@/app/[lang]/(dashboard)/(user-mangement)/shared/basic-select";

const Withdraw = () => {
  const { lang } = useParams();

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="secondary"
          >
            {" "}
            <Icon icon="vaadin:money-withdraw" width="16" height="16" />{" "}
          </Button>
        </SheetTrigger>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-lg p-5 overflow-y-scroll"
        >
          <SheetHeader className="py-3 pl-3.5">
            <SheetTitle>Send Money</SheetTitle>
          </SheetHeader>
          <hr />

          <div className="flex flex-col gap-5 ">
            <div className="flex flex-row mt-5 justify-between w-full gap-[10px]  mx-auto  items-center">
              <div className="flex flex-col gap-2 w-full">
                <Label> IBAN Number</Label>
                <Input
                  type="number"
                  placeholder=" Enter IBAN Number"
                  value={"219038982309839021830912"}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label> Bank Name</Label>
                <BasicSelect />
              </div>
            </div>
            <div className="flex flex-row justify-between w-full gap-[10px]  mx-auto  items-center">
              <div className="flex flex-col gap-2 w-full">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="
                   Enter Amount"
                />{" "}
              </div>
              <div className="flex flex-col gap-2 w-full"></div>
            </div>

            <div className=" flex justify-center gap-3 mt-4 w-[90%] mx-auto">
              <SheetClose asChild>
                <Button type="button" className="w-full" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="button" className="w-full">
                <Button type="button" className="w-full">
                  Send Money
                </Button>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Withdraw;
