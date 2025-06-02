"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";

const DeleteButton = () => {
  const { t, loading, error } = useTranslate();

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
          color="secondary"
        >
          <Icon icon="heroicons:trash" className="h-4 w-4" />
        </Button>{" "}
      </DialogTrigger>

      <DialogContent className="p-6 !h-auto" size="md">
        <div className="flex flex-col items-center text-center">
          <span className="text-8xl text-destructive">
            <Icon icon="wpf:delete-shield" color="destructive" />
          </span>
          <h3 className="mt-6 mb-4 text-destructive text-xl font-semibold">
            {t("Deleting Items")}{" "}
          </h3>
          <p className="text-sm text-default-500 ">
            <p>{t("Are You Sure For Delete This Item?")}</p>
          </p>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="submit" variant="outline" color="destructive" >
              {t("Disagree")}
            </Button>
          </DialogClose>

          <Button type="submit" color="primary">
            {t("Agree")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
