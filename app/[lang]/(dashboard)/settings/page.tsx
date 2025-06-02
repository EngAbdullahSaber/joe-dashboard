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
        <TabsList className="grid w-full grid-cols-2 h-14 border bg-background">
          <TabsTrigger
            value="Website Setting"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Icon
              icon="tdesign:component-breadcrumb"
              className="h-5 w-5 mr-2"
            />
            {t("Website Setting")}
          </TabsTrigger>
          <TabsTrigger
            value="Social Media"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Icon icon="carbon:data-table" className="h-5 w-5 mr-2" />
            {t("Social Media")}
          </TabsTrigger>{" "}
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
