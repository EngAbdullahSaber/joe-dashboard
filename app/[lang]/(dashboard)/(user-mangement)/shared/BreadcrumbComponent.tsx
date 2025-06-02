"use client";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useTranslate } from "@/config/useTranslation";

const BreadcrumbComponent = ({
  header,
  body,
}: {
  header: string;
  body: string;
}) => {
  const { t } = useTranslate();
  return (
    <Breadcrumbs disabled>
      <BreadcrumbItem>{t(header)}</BreadcrumbItem>
      <BreadcrumbItem> {t(body)}</BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default BreadcrumbComponent;
