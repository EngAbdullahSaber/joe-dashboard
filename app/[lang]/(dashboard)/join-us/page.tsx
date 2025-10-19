"use client";

import React, { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import PageMeta from "./PageMeta";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

import PageSection from "./PageSection";
import { Auth } from "@/components/auth/Auth";
import TableDataCareer from "./TableDataCareer";
import { ExportExcelContactUsCareer } from "@/services/contactUs/contactUs";
import { useParams } from "next/navigation";
import { ImageUrl } from "@/services/app.config";
const page = () => {
  const { t } = useTranslate();
  const [isExporting, setIsExporting] = useState(false);
  const { lang } = useParams();
  const getExcelFileData = async () => {
    try {
      toast.loading("جاري تصدير الملف...", { id: "export-loading" });

      const response = await ExportExcelContactUsCareer(lang);
      console.log("Export result:", response);

      // 🟢 If backend returns JSON with filePath
      if (response?.success && response?.filePath) {
        toast.success("تم تصدير الملف بنجاح", { id: "export-loading" });

        // ✅ Fix: prepend API base URL
        const fileUrl = `${ImageUrl}${response.filePath}`;

        console.log("Downloading from:", fileUrl);

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `contacts_export_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Download initiated successfully");
        return;
      }

      // 🟡 If backend returns file directly (Blob)
      if (response instanceof Blob) {
        console.log("Received Excel file blob, starting download...");
        toast.success("تم تصدير الملف بنجاح", { id: "export-loading" });

        const blobUrl = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `contacts_export_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        console.log("Blob download done");
        return;
      }

      // 🔴 Otherwise — export failed
      console.error("Export failed:", response);
      toast.error("فشل في تصدير الملف", { id: "export-loading" });
    } catch (error) {
      console.error("Error exporting file:", error);
      toast.error("حدث خطأ أثناء تصدير الملف", { id: "export-loading" });
    }
  };

  return (
    <Tabs defaultValue="Join Us Page Meta">
      <TabsList className="flex w-full h-14 border bg-background">
        <TabsTrigger
          value="Join Us Page Meta"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="iconoir:page"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Join Us Page Meta")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="Join Us Page Section"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="tdesign:data"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Join Us Page Section")}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="Join Us Details"
          className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2 sm:px-4 min-w-0"
        >
          <Icon
            icon="tdesign:data"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {t("Join Us Details")}
          </span>
        </TabsTrigger>
      </TabsList>
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
            <Button
              variant="outline"
              onClick={getExcelFileData}
              disabled={isExporting}
              className="border-green-200 text-green-700 hover:bg-green-900 hover:border-green-300 transition-all duration-200"
            >
              {isExporting ? (
                <>
                  <Icon
                    icon="mdi:loading"
                    className="h-4 w-4 mr-2 animate-spin"
                  />
                  {t("Exporting")}
                </>
              ) : (
                <>
                  <Icon icon="mdi:file-excel" className="h-4 w-4 mr-2" />
                  {t("Export Excel")}
                </>
              )}
            </Button>
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
