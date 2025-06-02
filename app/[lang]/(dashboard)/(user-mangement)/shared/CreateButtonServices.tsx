"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useTranslate } from "@/config/useTranslation";
import { toast as reToast } from "react-hot-toast";
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
interface CreateButtonServicesProps {
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

const CreateButtonServices = ({
  entityName,
  fields,
  onCreate,
  onSuccess,
  onError,
  triggerText = `Create ${entityName}`,
  triggerIcon = "mingcute:add-line",
  refetch,
  pageId,
}: CreateButtonServicesProps) => {
  const { lang } = useParams();
  const router = useRouter();
  const { t } = useTranslate();
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
    setIsSubmitting(true);
    try {
      const response = await onCreate(
        data as any,
        lang as string,
        pageId as string
      );

      if (response) {
        reToast.success(t("Created"));
        reset();

        if (onSuccess) {
          onSuccess(data as any, response);
        }

        // Navigate back or to a success page
        router.back();
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
    } finally {
      setIsSubmitting(false);
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
        } | null>(null);

        const fieldData = fieldValue || {};

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

          if (!trimmedKey) return;

          const updatedData = { ...fieldData };

          if (isEditing) {
            if (isEditing.index !== undefined) {
              // Editing array item
              updatedData[isEditing.key][isEditing.index] = parsedValue;
            } else {
              // Editing object property or top-level key
              updatedData[isEditing.key] = parsedValue;
            }
          } else {
            // Adding new property
            updatedData[trimmedKey] = parsedValue;
          }

          setValue(field.name, updatedData);
          setNewRecordKey("");
          setNewRecordValue("");
          setValueType("string");
          setIsEditing(null);
        };

        const handleRemoveRecord = (keyToRemove: string, index?: number) => {
          const updatedData = { ...fieldData };

          if (index !== undefined && Array.isArray(updatedData[keyToRemove])) {
            updatedData[keyToRemove].splice(index, 1);
            if (updatedData[keyToRemove].length === 0) {
              delete updatedData[keyToRemove];
            }
          } else {
            delete updatedData[keyToRemove];
          }

          setValue(field.name, updatedData);
        };

        const handleEditRecord = (key: string, value: any, index?: number) => {
          setNewRecordKey(key);
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
          setIsEditing({ key, index });
        };

        const renderValue = (value: any): React.ReactNode => {
          if (Array.isArray(value)) {
            return (
              <div className="ml-4 space-y-1">
                {value.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm">- {String(item)}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditRecord("", item, index)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        {t("Edit")}
                      </button>
                      <button
                        onClick={() => handleRemoveRecord("", index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        {t("Remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          } else if (typeof value === "object" && value !== null) {
            return (
              <div className="ml-4 space-y-1">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="flex items-center gap-2">
                    <span className="text-sm font-medium">{subKey}:</span>
                    <span className="text-sm">{String(subValue)}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditRecord(subKey, subValue)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        {t("Edit")}
                      </button>
                      <button
                        onClick={() => {
                          const updated = { ...value };
                          delete updated[subKey];
                          const updatedData = { ...fieldData };
                          updatedData[key] =
                            Object.keys(updated).length > 0
                              ? updated
                              : undefined;
                          setValue(field.name, updatedData);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        {t("Remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          return <span className="text-sm">{String(value)}</span>;
        };

        return (
          <div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Property key"
                  value={newRecordKey}
                  onChange={(e) => setNewRecordKey(e.target.value)}
                  className="flex-1"
                  disabled={!!isEditing?.index} // Disable when editing array item
                />
                <select
                  value={valueType}
                  onChange={(e) => setValueType(e.target.value as any)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="string">String</option>
                  <option value="array">Array</option>
                  <option value="object">Object</option>
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
                    if (e.key === "Enter") handleAddRecord();
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
                  {isEditing ? "Update" : "Add"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => {
                      setNewRecordKey("");
                      setNewRecordValue("");
                      setValueType("string");
                      setIsEditing(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    {t("Cancel")}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {Object.entries(fieldData).map(([key, value]) => (
                <div key={key} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{key}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRecord(key, value)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        {t("Edit")}
                      </button>
                      <button
                        onClick={() => handleRemoveRecord(key)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        {t("Remove")}
                      </button>
                    </div>
                  </div>
                  {renderValue(value)}
                </div>
              ))}
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t(`Create New ${entityName}`)}</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <Icon icon="heroicons:arrow-left" className="h-4 w-4" />
          {t("Back")}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow"
      >
        <Tabs defaultValue="English" className="flex flex-col gap-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="English">{t("English")}</TabsTrigger>
            <TabsTrigger value="Arabic">{t("Arabic")}</TabsTrigger>
          </TabsList>

          {["English", "Arabic"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("Creating...") : t("Create")}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
};

export default CreateButtonServices;
