"use client";

import React, { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import CreatePhoto from "./CreatePhoto";
import PhotoCards from "./PhotoCards";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <h1 className="text-default-900 text-2xl font-bold my-2">
            {t("Uploaded Images Management")}
          </h1>
          <BreadcrumbComponent
            header="Uploaded Images Management"
            body="Uploaded Images"
          />
        </div>
        <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
          <CreatePhoto setFlag={setFlag} flag={flag} />
        </div>
      </div>
      <PhotoCards flag={flag} setFlag={setFlag} />
    </div>
  );
};

const ProtectedComponent = Auth()(page);
export default ProtectedComponent;
