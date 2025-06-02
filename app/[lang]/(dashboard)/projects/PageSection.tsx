"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { getSpecifiedPageMeta } from "@/services/page-meta/page-meta";
import UpdateButtonSection from "../(user-mangement)/shared/UpdateButtonSection";
import { CreateMedia } from "@/services/auth/auth";
import {
  DeleteSection,
  UpdateSpecifiedSection,
} from "@/services/sections/sections";
import { CreateSection } from "@/services/sections/sections";
import CreateButtonSection from "../(user-mangement)/shared/CreateButtonSection";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import DeleteConfirmationDialog from "../(user-mangement)/shared/DeleteButton";
import { ImageUrl } from "@/services/app.config";
type Section = {
  id: string;
  type: string;
  visible: string;
  position: number;
  title: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  list?: {
    en: string[];
    ar: string[];
  };
  image?: {
    url: string;
    alt: string;
    id?: number;
  };
  objectData?: {
    en: Record<string, any>;
    ar: Record<string, any>;
  };
};

type PageData = {
  id: string; // ✅ Add this line

  sections: Section[];
};
type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "image"
    | "number"
    | "mutli_image"
    | "keywords"
    | "record"
    | "checkbox"
    | "select"
    | "alt_text";
  tab: "English" | "Arabic";
  options?: any;
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
const PageSection = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [data, setData] = useState<PageData | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [flag, setFlag] = useState<boolean>(false);

  const sectionFields: FieldConfig[] = [
    {
      name: "titleEn",
      label: "English Title",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "titleAr",
      label: "Arabic Title",
      type: "text",
      tab: "Arabic",
      required: true,
    },
    {
      name: "contentEn",
      label: "English Content",
      type: "textarea",
      tab: "English",
      required: true,
    },
    {
      name: "contentAr",
      label: "Arabic Content",
      type: "textarea",
      tab: "Arabic",
      required: true,
    },
    {
      name: "imageUrl",
      label: "image",
      type: "image",
      tab: "English",
      required: true,
    },
    {
      name: "imageAlt",
      label: "Image Alt Text",
      type: "text",
      tab: "English",
      required: true,
    },
    {
      name: "listEn",
      label: "English List Items",
      type: "keywords",
      tab: "English",
      required: true,
    },
    {
      name: "listAr",
      label: "Arabic List Items",
      type: "keywords",
      tab: "Arabic",
      required: true,
    },
    {
      name: "visible",
      label: "Visible",
      type: "checkbox", // Would be better as a switch/checkbox in a real implementation
      tab: "English",
    },
    {
      name: "objectDataEn",
      label: "structured data",
      type: "record",
      tab: "English",
      required: true,
    },
    {
      name: "objectDataAr",
      label: "structured data",
      type: "record",
      tab: "Arabic",
      required: true,
    },
    {
      name: "position",
      label: "Position",
      type: "number",
      tab: "English",
      required: true,
    },
  ];

  const getData = async () => {
    try {
      const res = await getSpecifiedPageMeta(lang, "projects");
      setData(res || { sections: [] });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [lang]);

  const displayContent = (content: any) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof content === "object") {
      return (
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
    return content || "-";
  };

  // Initial data structure for a new section
  const initialSectionData = {
    id: "",
    type: "hero",
    visible: "true",
    position: null,
    titleEn: "",
    titleAr: "",
    contentEn: "",
    contentAr: "",
    listEn: [],
    listAr: [],
    imageUrl: "",
    imageAlt: "",
    objectDataEn: {},
    objectDataAr: {},
  };
  const handleDelete = async (pageId: any, sectionId: any) => {
    try {
      const res = await DeleteSection(pageId, sectionId, lang);

      if (res?.message) {
        const successMessage =
          typeof res.message === "string"
            ? res.message
            : lang === "en"
            ? res.message.english
            : res.message.arabic;

        reToast.success(successMessage);
      } else {
        reToast.success(t("Section deleted successfully"));
      }

      await getData(); // Refresh data after successful deletion
      return true; // Indicate success
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | { english?: string; arabic?: string };
        error?: string;
      }>;

      let errorMessage = t("Deletion failed");

      // Handle different error response formats
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data;

        if (typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (typeof responseData.message === "object") {
          errorMessage =
            lang === "en"
              ? responseData.message.english || errorMessage
              : responseData.message.arabic || errorMessage;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
      }

      reToast.error(errorMessage);
      return false; // Indicate failure
    }
  };
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex justify-between items-center flex-row w-full">
            {t("page sections")}

            <CreateButtonSection
              entityName="Section"
              fields={sectionFields}
              onCreate={async (data, lang, pageId) => {
                try {
                  let ogImageId = data.imageUrl;

                  if (data.imageUrl && typeof data.imageUrl !== "string") {
                    const formData = new FormData();
                    formData.append("files", data.imageUrl);
                    formData.append("alt[0]", data.imageAlt || "");

                    const imageResponse = await CreateMedia(formData, lang);
                    ogImageId = imageResponse[0];
                  }

                  const payload: any = {
                    id: "secProjectsPage" + data["position"],
                    type: data["type"],
                    visible: data["visible"],
                    position: data["position"],
                    content: {
                      en: data["contentEn"],
                      ar: data["contentAr"],
                    },
                    title: {
                      en: data["titleEn"],
                      ar: data["titleAr"],
                    },
                    list: {
                      en: data["listEn"] || [],
                      ar: data["listAr"] || [],
                    },
                    image:
                      typeof ogImageId === "string"
                        ? { alt: data["imageAlt"], url: data["imageUrl"] }
                        : ogImageId,
                    objectData: {
                      en: data["objectDataEn"],
                      ar: data["objectDataAr"],
                    },
                  };

                  const response = await CreateSection(payload, lang, pageId);
                  getData(); // Refresh the data
                  return response;
                } catch (error) {
                  throw error;
                }
              }}
              pageId={data?.id}
              refetch={getData}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {data?.sections?.map((section) => {
              // Prepare current data for the update form
              const currentSectionData = {
                id: section?.id,
                type: section?.type,
                visible: section?.visible,
                position: section?.position,
                titleEn: section?.title?.en,
                titleAr: section?.title?.ar,
                contentEn: section?.content?.en,
                contentAr: section?.content?.ar,
                listEn: section?.list?.en,
                listAr: section?.list?.ar,
                imageUrl: section?.image?.url,
                imageAlt: section?.image?.alt,
                objectDataEn: section?.objectData?.en,
                objectDataAr: section?.objectData?.ar,
              };

              return (
                <div key={section.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {section.title[lang as "en" | "ar"]}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-200">
                        {t("Type")}: {section.type} | {t("Position")}:{" "}
                        {section.position} |{t("Status")}:{" "}
                        {section.visible ? t("Visible") : t("Hidden")}
                      </p>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-2">
                      {" "}
                      <UpdateButtonSection
                        entityName="Section"
                        initialData={initialSectionData}
                        currentData={currentSectionData}
                        fields={sectionFields}
                        onUpdate={async (changedData, id, lang) => {
                          try {
                            let ogImageId = changedData.imageUrl;

                            if (
                              changedData.imageUrl &&
                              typeof changedData.imageUrl !== "string"
                            ) {
                              const formData = new FormData();
                              formData.append("files", changedData.imageUrl);
                              formData.append(
                                "alt[0]",
                                changedData.imageAlt || ""
                              );

                              const imageResponse = await CreateMedia(
                                formData,
                                lang
                              );
                              ogImageId = imageResponse[0];
                            }

                            const payload: any = {
                              type: changedData["type"],
                              visible: changedData["visible"],
                              position: changedData["position"],

                              content: {
                                en: changedData["contentEn"],
                                ar: changedData["contentAr"],
                              },
                              title: {
                                en: changedData["titleEn"],
                                ar: changedData["titleAr"],
                              },
                              list: {
                                en: changedData["listEn"] || [],
                                ar: changedData["listAr"] || [],
                              },
                              image:
                                typeof ogImageId == "string"
                                  ? {
                                      alt: changedData["imageAlt"],
                                      url: changedData["imageUrl"],
                                    }
                                  : ogImageId,

                              objectData: {
                                en: changedData["objectDataEn"],
                                ar: changedData["objectDataAr"],
                              },
                            };

                            const response = await UpdateSpecifiedSection(
                              payload,
                              data.id,
                              id,
                              lang
                            );
                            getData();
                            return response;
                          } catch (error) {
                            throw error;
                          }
                        }}
                        itemId={section.id}
                        setOpen={(open) =>
                          open
                            ? setOpenSectionId(section.id)
                            : setOpenSectionId(null)
                        }
                        open={openSectionId === section.id}
                        setFlag={setFlag}
                        flag={flag}
                        triggerText="Update Section"
                      />{" "}
                      {/* <DeleteConfirmationDialog
                        title="Deleting Section"
                        description="Are You Sure For Delete This Section?"
                        handleDelete={() => handleDelete(data.id, section.id)}
                        id={section.id} // Pass the id directly
                      />{" "} */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Content */}
                    <div>
                      <h4 className="font-medium mb-2">{t("Content")}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-200">
                        {displayContent(section.content[lang as "en" | "ar"])}
                      </div>
                    </div>

                    {/* List */}
                    {section.list && (
                      <div>
                        <h4 className="font-medium mb-2">{t("List")}</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-200">
                          {section.list[lang as "en" | "ar"]?.map(
                            (item, index) => (
                              <li key={index}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Image */}
                    {section.image && (
                      <div>
                        <h4 className="font-medium mb-2">{t("Image")}</h4>
                        <div className="flex flex-col space-y-2">
                          <img
                            src={`${ImageUrl}${section.image.url}`}
                            alt={section.image.alt}
                            className="w-40 h-auto border rounded"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            <strong>{t("Alt Text")}:</strong>{" "}
                            {section.image.alt || "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Object Data */}
                    {section.objectData && (
                      <div>
                        <h4 className="font-medium mb-2">
                          {t("Additional Data")}
                        </h4>
                        <pre className="text-sm bg-gray-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 p-2 rounded overflow-auto">
                          {JSON.stringify(
                            section.objectData[lang as "en" | "ar"],
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageSection;
