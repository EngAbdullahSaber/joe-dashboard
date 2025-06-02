"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from  './style.module.css'


const ViewMore = ({ data, title }: any) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [showImg, setshowImg] = useState<any>();

  const originalData = data;

  const renderOriginalData = (originalData: any) => {
    const entries = Object.entries(originalData);

    const chunkSize = 4;

    const chunks = [];
    for (let i = 0; i < entries.length; i += chunkSize) {
      chunks.push(entries.slice(i, i + chunkSize));
    }
    // console.log(chunks);
    // Render chunks
    return chunks.map((chunk, index) => (
      <div
        key={index}
        className="grid grid-cols-2   gap-4 border-b p-[10px] py-[20px] "
      >
        {chunk.map(([key, value]) => (
          <div
            key={key}
            className="grid max-sm:grid-cols-1 grid-cols-[100px,1fr] gap-[15px] "
          >
            <span className="text-sm capitalize font-[700] text-default-600 ">
              {" "}
              {t(`${key.toLowerCase()}`)}
            </span>
            <span className={`text-default-500  sm:text-center sm:mx-auto ${styles.wordWrap}`}>
              {" "}
              {key == "planogramPhoto" ||
              key == "merchandiserPhoto" ||
              key == "shelfPhoto" ? (
                <span
                  onClick={() => setshowImg(value)}
                  className="max-w-[500px] truncate font-medium object-cover rounded-[50%] w-[30px] h-[30px] mx-auto cursor-pointer hover:opacity-70 duration-300"
                >
                  <Image
                    className="rounded-[50%] w-[30px] h-[30px] "
                    src={String(value)}
                    alt=""
                    width={30}
                    height={30}
                  />
                </span>
              ) : (
                String(value)
              )}{" "}
            </span>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {/* <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            color="secondary"
          >
            <Icon icon="heroicons:eye" className="h-4 w-4" />
            
          </Button> */}
          <span className={styles.btnOpenModelDetails}>View Results </span>
        </SheetTrigger>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-[736px]"
        >
          <SheetHeader>
            <SheetTitle>{t('detailsLocation')}</SheetTitle>
          </SheetHeader>
          <div className="py-6">{renderOriginalData(originalData)}</div>
          <SheetFooter>
            <SheetClose asChild>footer content</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {showImg && (
        <Sheet open={!!showImg} onOpenChange={() => setshowImg(null)}>
          <SheetContent
            side={lang !== "ar" ? "left" : "right"}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="max-w-full h-full flex flex-col items-center justify-center max-md:w-full "
          >
            {/* <SheetHeader>
              <SheetTitle>{t('Image Preview')}</SheetTitle>
            </SheetHeader> */}
            <div className="flex items-center justify-center py-6">
              <Image src={showImg} alt="Popup Image" width={500} height={500} className=" w-full h-full rounded-lg" />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ViewMore;
