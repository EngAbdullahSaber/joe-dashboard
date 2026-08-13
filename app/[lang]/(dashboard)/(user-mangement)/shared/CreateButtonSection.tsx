"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { toast as reToast } from "react-hot-toast";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import ImageUploader from "../../shared/ImageUploader";
import { AxiosError } from "axios";

type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "image"
    | "number"
    | "section_image"
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
type FieldError = {
  field: string;
  message: string;
};
interface CreateButtonSectionProps {
  entityName: string;
  fields: FieldConfig[];
  onCreate: (data: any, lang: string, id: string) => Promise<any>;
  onSuccess?: (data: any, response: any) => void;
  onError?: (error: any) => void;
  triggerText?: string;
  triggerIcon?: string;
  refetch?: () => void;
  pageId: string | undefined;
}
type ErrorResponse = {
  statusCode: number;
  error: string;
  message: string | FieldError[];
};

const CreateButtonSection = ({
  entityName,
  fields,
  onCreate,
  onSuccess,
  onError,
  triggerText = `Create ${entityName}`,
  triggerIcon = "mingcute:add-line",
  refetch,
  pageId,
}: CreateButtonSectionProps) => {
  const { lang } = useParams();
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Zod schema dynamically based on fields configuration
  const createSchema = () => {
    const schemaObj: Record<string, ZodTypeAny> = {};

    fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "alt_text":
        case "textarea": {
          let validator = z.string(); // inferred as ZodString

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

          schemaObj[field.name] = validator;
          break;
        }
        case "number": {
          // Create a pre-processed validator
          const preprocessed = z.preprocess(
            (val) => {
              if (val === "" || val === null || val === undefined) return val;
              return Number(val);
            },
            z
              .number({
                required_error: field.required
                  ? `${field.label} is required`
                  : undefined,
                invalid_type_error: `${field.label} must be a number`,
              })
              .min(0, `${field.label} must be greater than 0`)
          );

          schemaObj[field.name] = preprocessed;
          break;
        }
        case "record": {
          // Start with a record validator
          let validator: z.ZodType<Record<string, string>> = z.record(
            z.string()
          );

          // Add required validation if needed
          if (field.required) {
            validator = validator.refine(
              (val) => Object.keys(val || {}).length > 0,
              {
                message: `${field.label} is required`,
              }
            );
          }

          schemaObj[field.name] = validator;
          break;
        }

        case "select": {
          schemaObj[field.name] = z.any(); // optionally refine later
          break;
        }

        case "keywords": {
          let validator = z.array(z.string());
          if (field.required) {
            validator = validator.min(1, `${field.label} is required`);
          }
          schemaObj[field.name] = validator;
          break;
        }

        case "image":
        case "section_image": {
          const validator = z.custom<File | string>(
            (value) =>
              value instanceof File ||
              (typeof value === "string" && value.trim().length > 0),
            {
              message:
                field.validation?.message || `${field.label} is required`,
            }
          );
          schemaObj[field.name] = validator;
          break;
        }

        default: {
          schemaObj[field.name] = z.any(); // fallback
          break;
        }
      }
    });

    return z.object(schemaObj);
  };
  const schema = createSchema();
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "hero",
      visible: "true",
      position: 0,
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
    },
  });

  const handleInputChange = async (field: string, value: any) => {
    setValue(field, value);
    await trigger(field);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await onCreate(
        data as any,
        lang as string,
        pageId as string
      );

      if (response) {
        reToast.success(t("Created"));

        setIsDialogOpen(false);
        reset();

        if (onSuccess) {
          onSuccess(data as any, response);
        }
      }
    } catch (error) {
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
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
          </div>
        );
      case "record": {
        const [newRecordKey, setNewRecordKey] = useState("");
        const [newRecordValue, setNewRecordValue] = useState("");
        const [valueType, setValueType] = useState<
          "string" | "array" | "object"
        >("string");
        const [isEditing, setIsEditing] = useState<{
          key: string;
          index?: number;
          objectSubKey?: string;
        } | null>(null);

        const fieldData = fieldValue || {};

        const resetRecordForm = () => {
          setNewRecordKey("");
          setNewRecordValue("");
          setValueType("string");
          setIsEditing(null);
        };

        const handleAddRecord = () => {
          const trimmedKey = newRecordKey.trim();
          let parsedValue: any;

          try {
            if (valueType === "array") {
              parsedValue = newRecordValue
                .split(",")
                .map((item) => item.trim());
            } else if (valueType === "object") {
              parsedValue = JSON.parse(newRecordValue);
            } else {
              parsedValue = newRecordValue;
            }
          } catch (e) {
            reToast.error("Invalid format for selected type");
            return;
          }

          const updatedData = { ...fieldData };

          if (isEditing) {
            if (isEditing.index !== undefined) {
              // Editing an item inside an array property
              const arr = [...(updatedData[isEditing.key] || [])];
              arr[isEditing.index] = parsedValue;
              updatedData[isEditing.key] = arr;
            } else if (isEditing.objectSubKey !== undefined) {
              // Editing a property inside a nested object
              const nested = { ...(updatedData[isEditing.key] || {}) };
              if (trimmedKey && trimmedKey !== isEditing.objectSubKey) {
                delete nested[isEditing.objectSubKey];
                nested[trimmedKey] = parsedValue;
              } else {
                nested[isEditing.objectSubKey] = parsedValue;
              }
              updatedData[isEditing.key] = nested;
            } else {
              // Editing a top-level property (rename-aware)
              if (!trimmedKey) return;
              if (trimmedKey !== isEditing.key) {
                delete updatedData[isEditing.key];
              }
              updatedData[trimmedKey] = parsedValue;
            }
          } else {
            if (!trimmedKey) return;
            updatedData[trimmedKey] = parsedValue;
          }

          setValue(field.name, updatedData);
          resetRecordForm();
        };

        const handleRemoveRecord = (
          keyToRemove: string,
          index?: number,
          objectSubKey?: string
        ) => {
          const updatedData = { ...fieldData };

          if (objectSubKey !== undefined) {
            const nested = { ...(updatedData[keyToRemove] || {}) };
            delete nested[objectSubKey];
            if (Object.keys(nested).length > 0) {
              updatedData[keyToRemove] = nested;
            } else {
              delete updatedData[keyToRemove];
            }
          } else if (
            index !== undefined &&
            Array.isArray(updatedData[keyToRemove])
          ) {
            const arr = updatedData[keyToRemove].filter(
              (_: any, i: number) => i !== index
            );
            if (arr.length > 0) {
              updatedData[keyToRemove] = arr;
            } else {
              delete updatedData[keyToRemove];
            }
          } else {
            delete updatedData[keyToRemove];
          }

          if (
            isEditing &&
            isEditing.key === keyToRemove &&
            isEditing.index === index &&
            isEditing.objectSubKey === objectSubKey
          ) {
            resetRecordForm();
          }

          setValue(field.name, updatedData);
        };

        const handleEditRecord = (
          key: string,
          value: any,
          index?: number,
          objectSubKey?: string
        ) => {
          setNewRecordKey(objectSubKey !== undefined ? objectSubKey : key);
          if (Array.isArray(value)) {
            setNewRecordValue(value.join(", "));
            setValueType("array");
          } else if (typeof value === "object" && value !== null) {
            setNewRecordValue(JSON.stringify(value, null, 2));
            setValueType("object");
          } else {
            setNewRecordValue(String(value));
            setValueType("string");
          }
          setIsEditing({ key, index, objectSubKey });
        };

        const renderValue = (
          parentKey: string,
          value: any
        ): React.ReactNode => {
          if (Array.isArray(value)) {
            return (
              <div className="mt-2 space-y-1.5 border-l-2 border-default-200 pl-3 dark:border-default-300/20">
                {value.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-md bg-default-50 px-2.5 py-1.5 dark:bg-default-100/10"
                  >
                    <span className="text-sm break-all">{String(item)}</span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditRecord(parentKey, item, index)}
                      >
                        <Icon icon="heroicons:pencil" className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveRecord(parentKey, index)}
                      >
                        <Icon
                          icon="heroicons:trash"
                          className="h-3.5 w-3.5 text-red-500"
                        />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            );
          } else if (typeof value === "object" && value !== null) {
            return (
              <div className="mt-2 space-y-1.5 border-l-2 border-default-200 pl-3 dark:border-default-300/20">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div
                    key={subKey}
                    className="flex items-center justify-between gap-2 rounded-md bg-default-50 px-2.5 py-1.5 dark:bg-default-100/10"
                  >
                    <span className="text-sm break-all">
                      <span className="font-medium">{subKey}:</span>{" "}
                      {String(subValue)}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          handleEditRecord(parentKey, subValue, undefined, subKey)
                        }
                      >
                        <Icon icon="heroicons:pencil" className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          handleRemoveRecord(parentKey, undefined, subKey)
                        }
                      >
                        <Icon
                          icon="heroicons:trash"
                          className="h-3.5 w-3.5 text-red-500"
                        />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          return <span className="text-sm break-all">{String(value)}</span>;
        };

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-default-200 p-4 dark:border-default-300/20">
              <h4 className="mb-3 text-sm font-semibold text-default-700 dark:text-default-200">
                {isEditing ? t("Edit Property") : t("Add Property")}
              </h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={t("Property key")}
                    value={newRecordKey}
                    onChange={(e) => setNewRecordKey(e.target.value)}
                    className="flex-1"
                    disabled={isEditing?.index !== undefined} // Disable when editing an array item
                  />
                  <select
                    value={valueType}
                    onChange={(e) => setValueType(e.target.value as any)}
                    className="rounded-md border border-default-200 bg-background px-2 py-1 text-sm dark:border-default-300/20"
                  >
                    <option value="string">{t("String")}</option>
                    <option value="array">{t("Array")}</option>
                    <option value="object">{t("Object")}</option>
                  </select>
                </div>

                {valueType === "object" ? (
                  <Textarea
                    placeholder="Enter JSON object (e.g., {'key': 'value'})"
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                    rows={4}
                  />
                ) : valueType === "array" ? (
                  <Input
                    type="text"
                    placeholder="Comma-separated values (e.g., value1, value2)"
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                  />
                ) : (
                  <Input
                    type="text"
                    placeholder="Property value"
                    value={newRecordValue}
                    onChange={(e) => setNewRecordValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRecord();
                      }
                    }}
                  />
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddRecord}
                    variant="outline"
                    className="flex-1"
                  >
                    {isEditing ? t("Update") : t("Add")}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={resetRecordForm}
                      variant="outline"
                      className="flex-1"
                    >
                      {t("Cancel")}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(fieldData).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-default-200 p-3 dark:border-default-300/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium break-all">{key}</h4>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditRecord(key, value)}
                      >
                        <Icon icon="heroicons:pencil" className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        color="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveRecord(key)}
                      >
                        <Icon
                          icon="heroicons:trash"
                          className="h-3.5 w-3.5 text-red-500"
                        />
                      </Button>
                    </div>
                  </div>
                  {renderValue(key, value)}
                </div>
              ))}
              {Object.keys(fieldData).length === 0 && (
                <p className="text-sm text-default-500">
                  {t("No properties added yet")}
                </p>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
          </div>
        );
      }
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={!!fieldValue}
              {...register(field.name, {
                onChange: async (e) => {
                  const value = e.target.checked;
                  await handleInputChange(field.name, value);
                },
              })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-700"
            >
              {t(field.label)}
            </label>
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
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
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
          </div>
        );

      case "image":
        return (
          <div>
            <ImageUploader
              file={fieldValue as File | string | null}
              setFile={(file) => handleInputChange(field.name, file)}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
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
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
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
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger asChild>
        <Button color="default" className="gap-2">
          <Icon icon={triggerIcon} className="h-4 w-4" />
          {t(triggerText)}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="max-w-lg p-5 overflow-y-scroll max-h-[90vh]"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <SheetHeader>
          <SheetTitle>{t(`Create New ${entityName}`)}</SheetTitle>
        </SheetHeader>
        <hr />

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
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("Creating...") : t("Create")}
              </Button>
            </div>
          </Tabs>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateButtonSection;
