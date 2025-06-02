"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import { Auth } from "@/components/auth/Auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
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
              {t("Service Management")}
            </h1>
            <BreadcrumbComponent header="Service Management" body="Services" />
          </div>
          <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
            <Link href={`services/create`}>
              <Button>
                <Icon icon="mingcute:user-add-2-fill" className="h-4 w-4" />
                {t("Create Service")}
              </Button>
            </Link>{" "}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("Service Details")}</CardTitle>
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
