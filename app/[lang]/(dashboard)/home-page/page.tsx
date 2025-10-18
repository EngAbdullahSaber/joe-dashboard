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
      <TabsList className="flex w-full h-14 border bg-background">
        <TabsTrigger
          value="Home Page Meta"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="iconoir:page"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Home Page Meta")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="Home Page Section"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="tdesign:data"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Home Page Section")}
          </span>
        </TabsTrigger>
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
