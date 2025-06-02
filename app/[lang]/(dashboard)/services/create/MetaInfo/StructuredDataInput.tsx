import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  } | null>(null);

  const fieldData = value || {};

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

    onChange(updatedData);
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

    onChange(updatedData);
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
                      Object.keys(updated).length > 0 ? updated : undefined;
                    onChange(updatedData);
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
      <Label className="text-sm font-medium mb-2 block">{t("JSON-LD")}</Label>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Property key"
            value={newRecordKey}
            onChange={(e) => setNewRecordKey(e.target.value)}
            className="flex-1"
            disabled={!!isEditing?.index}
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
            {isEditing ? t("Update") : t("Add")}
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

      <p className="text-xs text-gray-500 mt-2">
        {t(
          "Structured data helps search engines understand your content better."
        )}
      </p>
    </div>
  );
};
