"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import SocialMedia from "./SocialMedia";
import WebsiteSetting from "./WebsiteSetting";

const page = () => {
  const { t } = useTranslate();

  return (
    <div>
      {" "}
      <Tabs defaultValue="Website Setting">
        <TabsList className="flex w-full h-14 border bg-background">
          <TabsTrigger
            value="Website Setting"
            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
          >
            <Icon
              icon="tdesign:component-breadcrumb"
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm truncate">
              {t("Website Setting")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="Social Media"
            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
          >
            <Icon
              icon="carbon:data-table"
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm truncate">
              {t("Social Media")}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Website Setting">
          <WebsiteSetting />
        </TabsContent>{" "}
        <TabsContent value="Social Media">
          <SocialMedia />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
