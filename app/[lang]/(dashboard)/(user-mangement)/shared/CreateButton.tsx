"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import ImageUploader from "../../shared/ImageUploader";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/config/useTranslation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { translateToArabic } from "@/services/auth/auth";
import Flatpickr from "react-flatpickr";

import BasicSelect from "./basic-select";
import MultiImageUploader from "../../shared/MultiImageUploader";
type FieldError = {
  field: string;
  message: string;
};

type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string | FieldError[];
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
    | "date"
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
interface CreateButtonProps<T extends Record<string, any>> {
  entityName: string;
  initialData: T;
  fields: FieldConfig[];
  onCreate: (data: T, lang: string) => Promise<any>;
  onSuccess?: (data: T, response: any) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
  triggerText?: string;
  triggerIcon?: string;
  setFlag?: (flag: boolean) => void;
  flag?: boolean;
}

const CreateButton = <T extends Record<string, any>>({
  entityName,
  initialData,
  fields,
  onCreate,
  onSuccess,
  onError,
  triggerText = `Create ${entityName}`,
  triggerIcon = "mingcute:user-add-2-fill",
  setFlag,
  flag,
}: CreateButtonProps<T>) => {
  const { lang } = useParams();
  const { t } = useTranslate();
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create Zod schema dynamically based on fields configuration
  const createSchema = () => {
    const schemaObj: Record<string, any> = {};

    fields.forEach((field) => {
      let validator = z.unknown();

      // Handle different field types
      switch (field.type) {
        case "text":
        case "alt_text":
        case "textarea":
          validator = z.string();
          if (field.required) {
            validator = validator.min(1, `${field.label} is required`);
          }
          if (field.validation?.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `${field.label} must be at least ${field.validation.minLength} characters`
            );
          }
          if (field.validation?.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `${field.label} must be at most ${field.validation.maxLength} characters`
            );
          }
          if (field.validation?.pattern) {
            validator = validator.regex(
              field.validation.pattern,
              field.validation.message || "Invalid format"
            );
          }
          if (field.validation?.url) {
            validator = validator.url("Please enter a valid URL");
          }
          break;
        case "mutli_image":
          validator = z.array(
            z.object({
              file: z.union([
                z.instanceof(File),
                z.string().min(1, "Image URL is required"),
              ]),
              alt: z.string().min(1, "Alternative text is required"),
            })
          );
          break;
        case "date":
          validator = z.union([z.string(), z.date()]).transform((val) => {
            if (typeof val === "string") {
              return new Date(val);
            }
            return val;
          });
          if (field.required) {
            validator = validator.refine(
              (val) => val instanceof Date && !isNaN(val.getTime()),
              {
                message: `${field.label} is required`,
              }
            );
          }
          break;
        case "number": {
          validator = z
            .any()
            .transform((val) => {
              if (val === "" || val === null || val === undefined) return null;
              if (typeof val === "string") val = Number(val);
              return typeof val === "number" && !isNaN(val) ? val : null;
            })
            .refine(
              (val) => {
                if (field.required) return val !== null && val > 0;
                return val === null || val > 0;
              },
              {
                message: field.required
                  ? `${field.label} must be a valid number greater than 0`
                  : `${field.label} must be greater than 0 if provided`,
              }
            );
          break;
        }
        case "select": {
          if (field.required) {
            schemaObj[field.name] = z.object(
              {
                id: z
                  .string()
                  .min(1, field.validation?.message || "Selection is required"),
                value: z.string(),
                label: z.string(),
              },
              {
                required_error:
                  field.validation?.message || "Selection is required",
              }
            );
          } else {
            schemaObj[field.name] = z
              .object({
                id: z.string().optional(),
                value: z.string().optional(),
                label: z.string().optional(),
              })
              .optional();
          }
          break;
        }
        case "image":
          validator = z.custom<File | string>(
            (value) => {
              // Valid if it's a File object or non-empty string
              return (
                value instanceof File ||
                (typeof value === "string" && value.trim().length > 0)
              );
            },
            {
              message: field.validation?.message || "",
            }
          );
          break;
      }

      schemaObj[field.name] = validator;
    });

    return z.object(schemaObj);
  };
  // Add this useEffect to log validation errors

  const schema = createSchema();
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control, // Add this line

    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //     console.log("Form validation errors:", errors);
  //     // Show all errors to user
  //     Object.entries(errors).forEach(([fieldName, error]) => {
  //       reToast.error(`${fieldName}: ${error.message}`);
  //     });
  //   }
  // }, [errors]);

  const handleInputChange = async (field: keyof T, value: any) => {
    setValue(field as string, value);
    await trigger(field as string);

    if (autoTranslate) {
      const fieldStr = field as string;

      // Auto-translate any field ending in 'En' and set its corresponding 'Ar' field
      if (fieldStr.endsWith("En")) {
        const arabicField = fieldStr.replace(/En$/, "Ar");

        try {
          const translated = await translateToArabic(value);
          if (translated) {
            setValue(arabicField as keyof T, translated);
          }
        } catch (error) {
          console.error(`Translation failed for ${fieldStr}:`, error);
        }
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("try");
    try {
      const response = await onCreate(data as T, lang as string);

      if (response) {
        reToast.success(t("Created"));

        setIsDialogOpen(false);
        reset();

        if (setFlag && flag !== undefined) {
          setFlag(!flag);
        }

        if (onSuccess) {
          onSuccess(data as T, response);
        }
      }
    } catch (error) {
      console.log("try");

      const axiosError = error as AxiosError<ErrorResponse>;

      if (onError) {
        onError(axiosError);
      } else {
        const response = axiosError.response?.data;
        if (Array.isArray(response?.message)) {
          const combinedMessage = response.message
            .map((err) => `${err.field}: ${err.message}`)
            .join("\n");
          reToast.error(combinedMessage);
        } else {
          reToast.error(response?.message || "An error occurred");
        }
      }
    }
  };

  const renderField = (field: FieldConfig) => {
    const fieldValue = watch(field.name);
    const error = errors[field.name]?.message;

    switch (field.type) {
      case "text":
        return (
          <div>
            <Input
              type="text"
              placeholder={t(field.label)}
              value={fieldValue || ""}
              {...register(field.name, {
                onChange: async (e) => {
                  const value = e.target.value;
                  await handleInputChange(field.name, value);
                },
              })}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "select":
        return (
          <div>
            <Controller
              name={field.name}
              control={control}
              defaultValue={initialData[field.name] || ""}
              render={({ field: { onChange, value } }) => (
                <BasicSelect
                  menu={field.options || []}
                  selectedValue={value}
                  setSelectedValue={(selectedOption) => {
                    onChange(selectedOption); // Send the whole option object
                  }}
                />
              )}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "number":
        return (
          <div>
            <Input
              type="number"
              placeholder={t(field.label)}
              value={fieldValue || ""}
              {...register(field.name, {
                onChange: async (e) => {
                  const value = e.target.value;
                  await handleInputChange(field.name, value);
                },
              })}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div>
            <Textarea
              placeholder={t(field.label)}
              value={fieldValue || ""}
              rows={5}
              {...register(field.name, {
                onChange: async (e) => {
                  const value = e.target.value;
                  await handleInputChange(field.name, value);
                },
              })}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "image":
        return (
          <div>
            <ImageUploader
              file={fieldValue as File | string | null}
              setFile={(file) => handleInputChange(field.name, file)}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "mutli_image":
        return (
          <div>
            <MultiImageUploader
              files={fieldValue as (File | string)[]}
              setFiles={(files) => handleInputChange(field.name, files)}
              projectId={0}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "keywords":
        const [newKeyword, setNewKeyword] = useState("");
        const keywords = fieldValue || [];

        const handleAddKeyword = () => {
          if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            const updatedKeywords = [...keywords, newKeyword.trim()];
            setValue(field.name, updatedKeywords);
            setNewKeyword("");
          }
        };

        const handleRemoveKeyword = (keywordToRemove: string) => {
          const updatedKeywords = keywords.filter(
            (keyword: string) => keyword !== keywordToRemove
          );
          setValue(field.name, updatedKeywords);
        };

        return (
          <div>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Add a keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddKeyword}
                variant="outline"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string) => (
                <div
                  key={keyword}
                  className="flex items-center gap-1 text-white bg-blue-700 px-2 py-1 rounded-full"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon icon="heroicons:x-mark" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "date":
        return (
          <div>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Flatpickr
                  value={value || ""}
                  onChange={([date]) => {
                    onChange(date);
                    trigger(field.name);
                  }}
                  options={{
                    dateFormat: "Y-m-d",
                    locale: lang === "ar" ? Arabic : undefined,
                    // Add more options as needed
                    appendTo: document.body,
                    static: true,
                    clickOpens: true,
                  }}
                  className="border border-default-300 !text-[#878b94] font-[300] capitalize-first pl-[30px] w-full cursor-pointer h-[36px] focus:border-[#2684ff] focus:outline-none rounded-[4px] px-2 placeholder:text-default-600"
                  placeholder={t(field.label)}
                />
              )}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      case "alt_text":
        return (
          <div>
            <Input
              type="text"
              placeholder={t(field.label)}
              value={fieldValue || ""}
              {...register(field.name, {
                onChange: async (e) => {
                  const value = e.target.value;
                  await handleInputChange(field.name, value);
                },
              })}
            />
            {error && <p className="text-xs text-red-500 mt-1">{t(error)}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger asChild>
          <Button>
            <Icon icon={triggerIcon} />
            {t(triggerText)}
          </Button>
        </SheetTrigger>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-lg p-5 overflow-y-scroll"
        >
          <SheetHeader className="py-3 pl-3.5">
            <SheetTitle>{t(`Create a New ${entityName}`)}</SheetTitle>
          </SheetHeader>
          <hr />

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="autoTranslate"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="autoTranslate">
              {t("Auto-translate to Arabic")}
            </Label>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="English" className="flex flex-col gap-[40px]">
              <TabsList className="grid w-full grid-cols-2 mt-[20px]">
                <TabsTrigger value="English">{t("English")}</TabsTrigger>
                <TabsTrigger value="Arabic">{t("Arabic")}</TabsTrigger>
              </TabsList>

              {["English", "Arabic"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="flex flex-col gap-5 my-4">
                    {fields
                      .filter((f) => f.tab === tab)
                      .map((field) => (
                        <div
                          key={field.name}
                          className="flex flex-col gap-2 w-full"
                        >
                          <Label>
                            {t(field.label)}
                            {field.required && " *"}
                          </Label>
                          {renderField(field)}
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}

              <div className="flex justify-center gap-3 mt-4 w-[90%] mx-auto">
                <SheetClose asChild>
                  <Button type="button" className="w-full" variant="outline">
                    {t("Cancel")}
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("Loading") : t(triggerText)}
                </Button>
              </div>
            </Tabs>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateButton;
