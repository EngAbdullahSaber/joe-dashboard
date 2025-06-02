"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import CreateMerchindizer from "./CreateMerchindizer";
import Create from "@/components/common/create/Create";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5  xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("UserManagment.merchandiser.Marchindaizer Management")}
          </div>{" "}
          <BreadcrumbComponent
            header={"UserManagment.merchandiser.User Management"}
            body={"UserManagment.merchandiser.Marchindaizer"}
          />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("management.retailers.Export Excel")}
          </Button>
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("management.retailers.Export PDF")}
          </Button>
          <CreateMerchindizer t={t} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {t("UserManagment.merchandiser.Marchindaizer Details")}{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
