"use client";

import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import CreateBlog from "./CreateBlog";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import PageSection from "./PageSection";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);

  return (
    <Tabs defaultValue="Page Meta">
      <TabsList className="flex w-full h-14 border bg-background">
        <TabsTrigger
          value="Page Meta"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="iconoir:page"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">{t("Page Meta")}</span>
        </TabsTrigger>
        <TabsTrigger
          value="Blog Section"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="tdesign:data"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Blog Section")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="Blog Details"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="ix:details"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Blog Details")}
          </span>
        </TabsTrigger>
      </TabsList>{" "}
      <TabsContent value="Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="Blog Section">
        <PageSection />
      </TabsContent>
      <TabsContent value="Blog Details">
        {" "}
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <h1 className="text-default-900 text-2xl font-bold my-2">
                {t("Blog Management")}
              </h1>
              <BreadcrumbComponent header="Blog Management" body="Blogs" />
            </div>
            <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
              <CreateBlog setFlag={setFlag} flag={flag} />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("Blogs Details")}</CardTitle>
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
