"use client";

import React, { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import PageSection from "./PageSection";
import { Auth } from "@/components/auth/Auth";
const page = () => {
  const { t } = useTranslate();

  return (
    <Tabs defaultValue="About Us Page Meta">
      <TabsList className="grid w-full grid-cols-2 h-14 border bg-background">
        <TabsTrigger
          value="About Us Page Meta"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="iconoir:page" className="h-5 w-5 mx-3" />
          {t("About Us Page Meta")}
        </TabsTrigger>
        <TabsTrigger
          value="About Us Page Section"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("About Us Page Section")}
        </TabsTrigger>{" "}
      </TabsList>{" "}
      <TabsContent value="About Us Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="About Us Page Section">
        <PageSection />
      </TabsContent>
    </Tabs>
  );
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
