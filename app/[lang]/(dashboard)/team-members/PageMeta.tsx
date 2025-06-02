"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import {
  getSpecifiedPageMeta,
  UpdateSpecifiedPageMeta,
} from "@/services/page-meta/page-meta";
import UpdateButtonSection from "../(user-mangement)/shared/UpdateButtonMeta";
import { CreateMedia } from "@/services/auth/auth";

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "keywords" | "record" | "alt_text";
  tab: "English" | "Arabic";
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    url?: boolean;
    custom?: (val: any) => boolean;
    message?: string;
  };
};

type PageMetaData = {
  slug: string;
  title: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: number | null; // This is the image ID
    ogUrl: string;
    ogType: string;
    structuredData: Record<string, any>;
    headScript: string;
    bodyScript: string;
  };
};

const PageMeta = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [data, setData] = useState<PageMetaData | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);

  // Define the fields configuration
  const fields: FieldConfig[] = [
    {
      name: "slug",
      label: "slug",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "title",
      label: "title",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "MetaTitle",
      label: "meta title",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "MetaDescription",
      label: "meta description",
      type: "textarea",
      tab: "English",
      required: true,
    },
    {
      name: "MetaKeywords",
      label: "keywords",
      type: "keywords",
      tab: "English",
      required: true,
    },
    {
      name: "MetaCanonicalUrl",
      label: "canonical URL",
      type: "text",
      tab: "English",
      required: true,
      validation: {
        url: true,
        message: "Must be a valid URL",
      },
    },
    {
      name: "MetaOgTitle",
      label: "og_tags title",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "MetaOgDescription",
      label: "og_tags description",
      type: "textarea",
      tab: "English",
      required: true,
    },
    {
      name: "MetaOgImage",
      label: "og_tags image",
      type: "image",
      tab: "English",
    },
    {
      name: "MetaOgImageAlt",
      label: "og_tags image alternative",
      type: "text",
      tab: "English",
    },
    {
      name: "MetaOgUrl",
      label: "og_tags url",
      type: "text",
      tab: "English",
      required: true,
      validation: {
        url: true,
        message: "Must be a valid URL",
      },
    },
    {
      name: "MetaOgType",
      label: "og_tags type",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "MetaStructuredData",
      label: "structured data",
      type: "record",
      tab: "English",
    },
    {
      name: "MetaHeadScript",
      label: "head script",
      type: "textarea",
      tab: "English",
      required: true,
    },
    {
      name: "MetaBodyScript",
      label: "body script",
      type: "textarea",
      tab: "English",
      required: true,
    },
  ];

  // Initial data structure
  const initialData = {
    slug: "",
    title: "",

    MetaTitle: "",
    MetaDescription: "",
    MetaKeywords: [],
    MetaCanonicalUrl: "",
    MetaOgTitle: "",
    MetaOgDescription: "",
    MetaOgImage: null,
    MetaOgImageAlt: "",
    MetaOgUrl: "",
    MetaOgType: "",
    MetaStructuredData: {},
    MetaHeadScript: "",
    MetaBodyScript: "",
  };

  const getData = async () => {
    try {
      const res = await getSpecifiedPageMeta(lang, "team-member");
      setData(res?.data || res); // Handle both response formats
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [lang]);
  const currentData = {
    slug: data?.slug,
    title: data?.title,
    MetaOgUrl: data?.meta?.ogUrl,
    MetaTitle: data?.meta?.title,
    MetaOgType: data?.meta?.ogType,
    MetaOgImage: data?.meta?.ogImage?.url || null,
    MetaOgImageId: data?.meta?.ogImage?.alt || null,
    MetaOgImageAlt: data?.meta?.ogImage?.alt || "",
    MetaKeywords: data?.meta?.keywords,
    MetaStructuredData: data?.meta?.structuredData,
    MetaHeadScript: data?.meta?.headScript,
    MetaBodyScript: data?.meta?.bodyScript,
    MetaCanonicalUrl: data?.meta?.canonicalUrl,
    MetaOgDescription: data?.meta?.ogDescription,
    MetaDescription: data?.meta?.description,
    MetaOgTitle: data?.meta?.ogTitle,
  };
  if (!data) {
    return <div>Loading...</div>;
  }

  // Helper function to display structured data nicely
  const displayStructuredData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return data || "-";
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t("page meta")}</CardTitle>
          <UpdateButtonSection
            entityName="Page Meta"
            initialData={initialData}
            currentData={currentData}
            fields={fields}
            onUpdate={async (changedData, id, lang) => {
              try {
                let ogImageId = changedData.MetaOgImageId;

                // Check if we have a new image to upload
                if (
                  changedData.MetaOgImage &&
                  typeof changedData.MetaOgImage !== "string"
                ) {
                  const formData = new FormData();
                  formData.append("files", changedData.MetaOgImage);
                  formData.append("alt[0]", changedData.MetaOgImageAlt || "");

                  const imageResponse = await CreateMedia(formData, lang);
                  ogImageId = imageResponse[0];
                }

                // Prepare the payload with the image ID
                const payload: any = {
                  title: changedData.title,
                  meta: {
                    title: changedData["MetaTitle"],
                    description: changedData["MetaDescription"],
                    keywords: changedData["MetaKeywords"],
                    canonicalUrl: changedData["MetaCanonicalUrl"],
                    ogTitle: changedData["MetaOgTitle"],
                    ogDescription: changedData["MetaOgDescription"],
                    ogImage: ogImageId, // Use the new or existing ID
                    ogUrl: changedData["MetaOgUrl"],
                    ogType: changedData["MetaOgType"],
                    structuredData: changedData["MetaStructuredData"],
                    headScript: changedData["MetaHeadScript"],
                    bodyScript: changedData["MetaBodyScript"],
                  },
                };

                const response = await UpdateSpecifiedPageMeta(
                  payload,
                  id,
                  lang
                );
                getData();
                return response;
              } catch (error) {
                throw error;
              }
            }}
            itemId={data?.id}
            setOpen={setOpen}
            open={open}
            setFlag={setFlag}
            flag={flag}
            triggerText="Update Page Meta"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field) => {
              // Get the value based on the field name
              let value;

              // Handle meta fields differently
              if (field.name.startsWith("Meta")) {
                // Remove "Meta" prefix and lowercase first letter
                const metaField = field.name.replace("Meta", "");
                const fieldName =
                  metaField.charAt(0).toLowerCase() + metaField.slice(1);
                value = data?.meta?.[fieldName as keyof typeof data.meta];
              } else {
                // Handle top-level fields
                value = data?.[field.name as keyof PageMetaData];
              }

              return (
                <div key={field.name} className="my-2">
                  <h4 className="font-medium text-lg">{t(field.label)}</h4>

                  {field.type === "keywords" && Array.isArray(value) ? (
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {value.map((keyword: string, index: number) => (
                        <li key={index}>{keyword}</li>
                      ))}
                    </ul>
                  ) : field.type === "record" ||
                    field.name === "MetaStructuredData" ? (
                    <pre className="text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                      {displayStructuredData(value)}
                    </pre>
                  ) : field.name === "MetaOgImage" ? (
                    <div className="space-y-2 text-sm text-gray-600">
                      {data?.meta?.ogImage?.url ? (
                        <>
                          <img
                            src={`${ImageUrl}${data.meta.ogImage.url}`}
                            alt={data.meta.ogImage.alt || "OG Image"}
                            className="w-40 h-auto border rounded"
                          />
                          <p>
                            <strong>Alt Text:</strong>{" "}
                            {data.meta.ogImage.alt || "-"}
                          </p>
                          <p>
                            <strong>ID:</strong> {data.meta.ogImage.id || "-"}
                          </p>
                        </>
                      ) : (
                        <p>No image uploaded</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value?.toString() || "-"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageMeta;
