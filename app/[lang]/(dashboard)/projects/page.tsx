"use client";

import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import PageSection from "./PageSection";
import CreateProject from "./CreateProject";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);

  return (
    <Tabs defaultValue="Page Meta">
      <TabsList className="grid w-full grid-cols-3 h-14 border bg-background">
        <TabsTrigger
          value="Page Meta"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="iconoir:page" className="h-5 w-5 mx-3" />
          {t("Page Meta")}
        </TabsTrigger>
        <TabsTrigger
          value="Project Section"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("Project Section")}
        </TabsTrigger>{" "}
        <TabsTrigger
          value="Project Details"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="ix:details" className="h-5 w-5 mx-3" />
          {t("Project Details")}
        </TabsTrigger>
      </TabsList>{" "}
      <TabsContent value="Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="Project Section">
        <PageSection />
      </TabsContent>
      <TabsContent value="Project Details">
        {" "}
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <h1 className="text-default-900 text-2xl font-bold my-2">
                {t("Project Management")}
              </h1>
              <BreadcrumbComponent
                header="Project Management"
                body="Projects"
              />
            </div>
            <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
              <CreateProject setFlag={setFlag} flag={flag} />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("Projects Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              {" "}
              <TableData flag={flag} setFlag={setFlag} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
