"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import CreateDepartment from "./CreateDepartment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import PageSection from "./PageSection";
import { Auth } from "@/components/auth/Auth";
const page = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);

  return (
    <>
      {" "}
      <div className="space-y-5">
        <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
          <div>
            <h1 className="text-default-900 text-2xl font-bold my-2">
              {t("Departments Management")}
            </h1>
            <BreadcrumbComponent
              header="Departments Management"
              body="Departments"
            />
          </div>
          <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
            <CreateDepartment setFlag={setFlag} flag={flag} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Departments Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            <TableData flag={flag} setFlag={setFlag} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const ProtectedComponent = Auth()(page);

export default ProtectedComponent;
