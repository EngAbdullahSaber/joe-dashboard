import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";

export const StructuredDataInput = ({
  value = {},
  onChange,
}: {
  value: object;
  onChange: (data: object) => void;
}) => {
  const { t } = useTranslate();
  const [newRecordKey, setNewRecordKey] = useState("");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [valueType, setValueType] = useState<"string" | "array" | "object">(
    "string"
  );
  const [isEditing, setIsEditing] = useState<{
    key: string;
    index?: number;
    objectSubKey?: string;
  } | null>(null);

  const fieldData: Record<string, any> = value || {};

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
        parsedValue = newRecordValue.split(",").map((item) => item.trim());
      } else if (valueType === "object") {
        parsedValue = JSON.parse(newRecordValue);
      } else {
        parsedValue = newRecordValue;
      }
    } catch (e) {
      // Handle JSON parse errors for objects
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

    onChange(updatedData);
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

    onChange(updatedData);
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

  const renderValue = (parentKey: string, value: any): React.ReactNode => {
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
    <div>
      <Label className="text-sm font-medium mb-2 block">{t("JSON-LD")}</Label>

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
                disabled={isEditing?.index !== undefined}
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
                placeholder={`Enter JSON object (e.g., {'key': 'value'})`}
                value={newRecordValue}
                onChange={(e) => setNewRecordValue(e.target.value)}
                rows={4}
                className="font-mono text-xs"
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
      </div>

      <p className="text-xs text-gray-500 mt-2">{t("Structured data")}</p>
    </div>
  );
};
