"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import TableDataUser from "./TableDataUser";
import TableDataOffer from "./TableDataOffer";
import { useTranslate } from "@/config/useTranslation";
import { Auth } from "@/components/auth/Auth";
import PageSection from "./PageSection";
import PageMeta from "./PageMeta";

const page = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [flag, setFlag] = useState(false);

  return (
    <Tabs defaultValue="Page Meta">
      <TabsList className="flex w-full h-14 border bg-background overflow-x-auto">
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
          value="ContactUs Section"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="tdesign:data"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("ContactUs Section")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="ContactUs Details"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="ix:details"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("ContactUs Details")}
          </span>
        </TabsTrigger>
      </TabsList>{" "}
      <TabsContent value="Page Meta">
        <PageMeta />
      </TabsContent>
      <TabsContent value="ContactUs Section">
        {" "}
        <PageSection />
      </TabsContent>
      <TabsContent value="ContactUs Details">
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <div>
              <h1 className="text-default-900 text-2xl font-bold my-2">
                {t("Contact Us User Management")}
              </h1>
              <BreadcrumbComponent
                header="Contact Us Users Management"
                body="Contact Us User Message"
              />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("Contact Us User Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TableDataUser />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Reusable Input Field Component
const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: any;
  value: any;
  onChange: any;
  placeholder: any;
}) => (
  <div className="my-2">
    <Label>{label}</Label>
    <Input value={value} onChange={onChange} placeholder={placeholder} />
  </div>
);

// Reusable Textarea Field Component
const TextareaField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: any;
  value: any;
  onChange: any;
  placeholder: any;
}) => (
  <div className="mt-2 mb-4">
    <Label>{label}</Label>
    <Textarea
      rows={7}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
