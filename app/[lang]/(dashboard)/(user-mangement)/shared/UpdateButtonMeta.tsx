"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import ImageUploader from "../../shared/ImageUploader";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/config/useTranslation";
import { z, ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import BasicSelect from "./basic-select";

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
    | "section_image"
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

interface UpdateButtonMetaProps<T extends Record<string, any>> {
  entityName: string;
  initialData: Partial<T>;
  currentData: T; // Current data to populate the form
  fields: FieldConfig[];
  onUpdate: (data: T, id: string, lang: string) => Promise<any>;
  onSuccess?: (data: T, response: any) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
  triggerText?: string;
  triggerIcon?: string;
  setFlag?: (flag: boolean) => void;
  flag?: boolean;
  itemId: string; // ID of the item being updated
}

const UpdateButtonMeta = <T extends Record<string, any>>({
  entityName,
  initialData,
  currentData,
  fields,
  onUpdate,
  onSuccess,
  onError,
  triggerText = `Update ${entityName}`,
  triggerIcon = "mingcute:edit-line",
  setFlag,
  flag,
  itemId,
}: UpdateButtonMetaProps<T>) => {
  const { lang } = useParams();
  const { t } = useTranslate();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

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
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (open) {
      reset(currentData);
    }
  }, [open, currentData, reset]);

  const handleInputChange = async (field: keyof T, value: any) => {
    setValue(field as string, value);
    await trigger(field as string);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await onUpdate(data as T, itemId, lang as string);
      if (response) {
        reToast.success(t("Updated"));
        if (setFlag && flag !== undefined) {
          setFlag(!flag);
        }
        if (onSuccess) {
          onSuccess(data as T, response);
        }
        setOpen?.(false);
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
          <div className="space-y-2">
            <ImageUploader
              file={fieldValue as File | string | null}
              setFile={(file) => {
                handleInputChange(field.name, file);
                // If this is the ogImage field, clear the ID since we're uploading a new image
                if (field.name === "MetaOgImage") {
                  setValue("MetaOgImageId", null);
                }
              }}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{t(String(error))}</p>
            )}
            {/* Show current image info if exists */}
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
      case "keywords": {
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
                {t("Add")}
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
      }

      default:
        return null;
    }
  };

  const handleOpen = () => {
    setOpen?.(!open);
  };

  return (
    <div className="flex sm:flex-row xs:flex-col gap-[10px] justify-between items-center">
      <Button
        size="icon"
        onClick={handleOpen}
        variant="outline"
        className=" h-7 w-7"
        color="secondary"
      >
        <Icon icon="heroicons:pencil" className="h-4 w-4" />
      </Button>{" "}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-lg p-5 overflow-y-scroll"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus on open
        >
          <SheetHeader className="py-3 pl-3.5">
            <SheetTitle>{t(`Update ${entityName}`)}</SheetTitle>
          </SheetHeader>
          <hr />

          <div>
            <div className="flex flex-col gap-5 my-4">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2 w-full">
                  <Label>
                    {t(field.label)}
                    {field.required && " *"}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-4 w-[90%] mx-auto">
              <SheetClose asChild>
                <Button type="button" className="w-full" variant="outline">
                  {t("Cancel")}
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-full"
                disabled={isSubmitting || isLoadingData}
              >
                {isSubmitting ? t("Updating") : t(triggerText)}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UpdateButtonMeta;
