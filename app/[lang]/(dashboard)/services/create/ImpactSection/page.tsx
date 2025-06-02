"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { CreateMedia } from "@/services/auth/auth";
import { ImageUrl } from "@/services/app.config";

interface ImpactStatistic {
  name: {
    en: string;
    ar: string;
  };
  count: string;
  desc: {
    en: string;
    ar: string;
  };
}

interface ImpactData {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  statics: ImpactStatistic[];
}

interface ImpactSectionProps {
  impact: ImpactData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

const ImpactSection: React.FC<ImpactSectionProps> = ({
  impact,
  setService,
  lang,
}) => {
  const { t } = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize impact with empty values if undefined
  const safeImpact = impact || {
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    statics: [],
  };

  // Handle bilingual field changes
  const handleBilingualChange = (
    field: keyof ImpactData,
    subField: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => ({
      ...prev,
      impact: {
        ...prev.impact,
        [field]: {
          ...prev.impact[field],
          [subField]: value,
        },
      },
    }));
  };

  // Handle statistic changes
  const handleStatisticChange = (
    index: number,
    field: keyof ImpactStatistic,
    subField: "en" | "ar" | "count",
    value: string
  ) => {
    setService((prev: any) => {
      const updatedStatistics = [...prev.impact.statics];
      if (field === "count") {
        updatedStatistics[index] = {
          ...updatedStatistics[index],
          [field]: value,
        };
      } else {
        updatedStatistics[index] = {
          ...updatedStatistics[index],
          [field]: {
            ...updatedStatistics[index][field],
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        impact: {
          ...prev.impact,
          statics: updatedStatistics,
        },
      };
    });
  };

  // Add new statistic
  const addStatistic = () => {
    setService((prev: any) => ({
      ...prev,
      impact: {
        ...prev.impact,
        statics: [
          ...prev.impact.statics,
          {
            name: { en: "", ar: "" },
            count: "",
            desc: { en: "", ar: "" },
          },
        ],
      },
    }));
  };

  // Remove statistic
  const removeStatistic = (index: number) => {
    setService((prev: any) => {
      const updatedStatistics = [...prev.impact.statics];
      updatedStatistics.splice(index, 1);
      return {
        ...prev,
        impact: {
          ...prev.impact,
          statics: updatedStatistics,
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">{t("Title")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs text-gray-500 mb-1">English</Label>
            <Input
              value={safeImpact.title.en}
              onChange={(e) =>
                handleBilingualChange("title", "en", e.target.value)
              }
              placeholder="Enter title in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeImpact.title.ar}
              onChange={(e) =>
                handleBilingualChange("title", "ar", e.target.value)
              }
              placeholder="Enter title in Arabic"
            />
          </div>
        </div>
      </div>

      {/* Subtitle Section */}
      <div>
        <Label className="block text-sm font-medium mb-1">
          {t("Subtitle")}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-xs text-gray-500 mb-1">English</Label>
            <Input
              value={safeImpact.subTitle.en}
              onChange={(e) =>
                handleBilingualChange("subTitle", "en", e.target.value)
              }
              placeholder="Enter subtitle in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeImpact.subTitle.ar}
              onChange={(e) =>
                handleBilingualChange("subTitle", "ar", e.target.value)
              }
              placeholder="Enter subtitle in Arabic"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label className="block text-sm font-medium">{t("Statistics")}</Label>
          <button
            type="button"
            onClick={addStatistic}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {t("Add Statistic")}
          </button>
        </div>

        {safeImpact.statics.length > 0 ? (
          <div className="space-y-4">
            {safeImpact.statics.map((statistic, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-medium">
                    {t("Statistic")} #{index + 1}
                  </Label>
                  <button
                    type="button"
                    onClick={() => removeStatistic(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    {t("Remove")}
                  </button>
                </div>

                {/* Statistic Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Name (English)
                    </Label>
                    <Input
                      value={statistic.name.en}
                      onChange={(e) =>
                        handleStatisticChange(
                          index,
                          "name",
                          "en",
                          e.target.value
                        )
                      }
                      placeholder="Enter name in English"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Name (Arabic)
                    </Label>
                    <Input
                      value={statistic.name.ar}
                      onChange={(e) =>
                        handleStatisticChange(
                          index,
                          "name",
                          "ar",
                          e.target.value
                        )
                      }
                      placeholder="Enter name in Arabic"
                    />
                  </div>
                </div>

                {/* Statistic Count */}
                <div className="mb-4">
                  <Label className="block text-xs text-gray-500 mb-1">
                    Count
                  </Label>
                  <Input
                    value={statistic.count}
                    onChange={(e) =>
                      handleStatisticChange(
                        index,
                        "count",
                        "count",
                        e.target.value
                      )
                    }
                    placeholder="Enter count (e.g., 450+, 45%)"
                  />
                </div>

                {/* Statistic Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Description (English)
                    </Label>
                    <Input
                      value={statistic.desc.en}
                      onChange={(e) =>
                        handleStatisticChange(
                          index,
                          "desc",
                          "en",
                          e.target.value
                        )
                      }
                      placeholder="Enter description in English"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Description (Arabic)
                    </Label>
                    <Input
                      value={statistic.desc.ar}
                      onChange={(e) =>
                        handleStatisticChange(
                          index,
                          "desc",
                          "ar",
                          e.target.value
                        )
                      }
                      placeholder="Enter description in Arabic"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            {t("No statistics added yet")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImpactSection;
