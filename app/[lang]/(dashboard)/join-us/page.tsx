"use client";

import React, { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PageSection from "./PageSection";
import { Auth } from "@/components/auth/Auth";
import TableDataCareer from "./TableDataCareer";
const page = () => {
  const { t } = useTranslate();

  return (
    <Tabs defaultValue="Join Us Page Meta">
      <TabsList className="grid w-full grid-cols-3 h-14 border bg-background">
        <TabsTrigger
          value="Join Us Page Meta"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="iconoir:page" className="h-5 w-5 mx-3" />
          {t("Join Us Page Meta")}
        </TabsTrigger>
        <TabsTrigger
          value="Join Us Page Section"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("Join Us Page Section")}
        </TabsTrigger>{" "}
        <TabsTrigger
          value="Join Us Details"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("Join Us Details")}
        </TabsTrigger>{" "}
      </TabsList>{" "}
      <TabsContent value="Join Us Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="Join Us Page Section">
        <PageSection />
      </TabsContent>
      <TabsContent value="Join Us Details">
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <h1 className="text-default-900 text-2xl font-bold my-2">
                {t("Join Us Management")}
              </h1>
              <BreadcrumbComponent
                header="Join Us Management"
                body="Join Us Message"
              />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("Join Us Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TableDataCareer />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
