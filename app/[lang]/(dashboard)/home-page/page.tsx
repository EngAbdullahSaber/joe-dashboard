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
    <Tabs defaultValue="Home Page Meta">
      <TabsList className="grid w-full grid-cols-2 h-14 border bg-background">
        <TabsTrigger
          value="Home Page Meta"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="iconoir:page" className="h-5 w-5 mx-3" />
          {t("Home Page Meta")}
        </TabsTrigger>
        <TabsTrigger
          value="Home Page Section"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("Home Page Section")}
        </TabsTrigger>{" "}
      </TabsList>{" "}
      <TabsContent value="Home Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="Home Page Section">
        <PageSection />
      </TabsContent>
    </Tabs>
  );
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
