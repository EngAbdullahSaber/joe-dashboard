import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Import an icon for the remove button
import { useTranslate } from "@/config/useTranslation";

export const KeywordsInput = ({
  value = [],
  onChange,
}: {
  value: string[];
  onChange: (keywords: string[]) => void;
}) => {
  const { t } = useTranslate();
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !value.includes(newKeyword.trim())) {
      const updatedKeywords = [...value, newKeyword.trim()];
      onChange(updatedKeywords);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const updatedKeywords = value.filter(
      (keyword) => keyword !== keywordToRemove
    );
    onChange(updatedKeywords);
  };

  return (
    <div>
      <Label className="text-sm font-medium">{t("Keywords")}</Label>
      <div className="flex gap-2 mb-2 mt-1">
        <Input
          type="text"
          placeholder={t("Add a keyword")}
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddKeyword();
            }
          }}
        />
        <Button type="button" onClick={handleAddKeyword} variant="outline">
          {t("Add")}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((keyword) => (
          <div
            key={keyword}
            className="flex items-center gap-1 text-white bg-blue-700 px-2 py-1 rounded-full text-sm"
          >
            <span>{keyword}</span>
            <button
              type="button"
              onClick={() => handleRemoveKeyword(keyword)}
              className="text-white hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
