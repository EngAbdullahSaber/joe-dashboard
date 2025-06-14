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
import TableDataCareer from "./TableDataCareer";
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
      <TabsList className="grid w-full grid-cols-3 h-14 border bg-background">
        <TabsTrigger
          value="Page Meta"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="iconoir:page" className="h-5 w-5 mx-3" />
          {t("Page Meta")}
        </TabsTrigger>
        <TabsTrigger
          value="ContactUs Section"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="tdesign:data" className="h-5 w-5 mx-3" />
          {t("ContactUs Section")}
        </TabsTrigger>{" "}
        <TabsTrigger
          value="ContactUs Details"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Icon icon="ix:details" className="h-5 w-5 mx-3" />
          {t("ContactUs Details")}
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
