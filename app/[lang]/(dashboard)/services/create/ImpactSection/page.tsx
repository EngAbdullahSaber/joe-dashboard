"use client";

import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Loader2 } from "lucide-react";

// Define Zod schema for validation
const impactSchema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required").max(100),
    ar: z.string().min(1, "Arabic title is required").max(100),
  }),
  subTitle: z.object({
    en: z.string().min(1, "English subtitle is required").max(150),
    ar: z.string().min(1, "Arabic subtitle is required").max(150),
  }),
  statics: z.array(
    z.object({
      name: z.object({
        en: z.string().min(1, "English name is required").max(50),
        ar: z.string().min(1, "Arabic name is required").max(50),
      }),
      count: z.string().min(1, "Count is required").max(20),
      desc: z.object({
        en: z.string().min(1, "English description is required").max(200),
        ar: z.string().min(1, "Arabic description is required").max(200),
      }),
    })
  ),
});

type ImpactFormData = z.infer<typeof impactSchema>;

interface ImpactSectionProps {
  impact: ImpactFormData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

export interface ImpactSectionRef {
  validateForm: () => Promise<boolean>;
}

const ImpactSection = forwardRef<ImpactSectionRef, ImpactSectionProps>(
  ({ impact, setService, lang }, ref) => {
    const { t } = useTranslate();
    const [isLoading, setIsLoading] = useState(true);

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      trigger,
      getValues,
      watch,
      reset,
    } = useForm<ImpactFormData>({
      resolver: zodResolver(impactSchema),
      defaultValues: {
        title: impact?.title || { en: "", ar: "" },
        subTitle: impact?.subTitle || { en: "", ar: "" },
        statics: impact?.statics || [],
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "statics",
    });

    // Watch for form changes to sync with parent state
    const watchedValues = watch();

    // Sync form values with parent service prop when it changes
    useEffect(() => {
      reset({
        title: impact?.title || { en: "", ar: "" },
        subTitle: impact?.subTitle || { en: "", ar: "" },
        statics: impact?.statics || [],
      });
      setIsLoading(false);
    }, [impact, reset]);

    // Expose validation method to parent component
    useImperativeHandle(
      ref,
      () => ({
        validateForm: async () => {
          const isValid = await trigger();
          if (isValid) {
            setService((prev: any) => ({
              ...prev,
              impact: getValues(),
            }));
          }
          return isValid;
        },
      }),
      [trigger, getValues, setService]
    );

    // Add new statistic
    const addStatistic = () => {
      append({
        name: { en: "", ar: "" },
        count: "",
        desc: { en: "", ar: "" },
      });
    };

    // Remove statistic
    const removeStatistic = (index: number) => {
      remove(index);
    };

    if (isLoading) {
      return <Loader2 className="h-6 w-6 animate-spin" />;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("Impact Section")}</h2>
          <p className="text-gray-600 mb-6">
            {t("Configure the impact statistics for your service")}
          </p>
        </div>

        {/* Title Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Title")} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("English")}
              </Label>
              <Controller
                name="title.en"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.title?.en ? "border-red-500" : ""}
                    placeholder="Enter title in English"
                  />
                )}
              />
              {errors.title?.en && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.title.en.message)}
                </p>
              )}
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("Arabic")}
              </Label>
              <Controller
                name="title.ar"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.title?.ar ? "border-red-500" : ""}
                    placeholder="Enter title in Arabic"
                  />
                )}
              />
              {errors.title?.ar && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.title.ar.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subtitle Section */}
        <div>
          <Label className="block text-sm font-medium mb-1">
            {t("Subtitle")} <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("English")}
              </Label>
              <Controller
                name="subTitle.en"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.subTitle?.en ? "border-red-500" : ""}
                    placeholder="Enter subtitle in English"
                  />
                )}
              />
              {errors.subTitle?.en && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.subTitle.en.message)}
                </p>
              )}
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                {t("Arabic")}
              </Label>
              <Controller
                name="subTitle.ar"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={errors.subTitle?.ar ? "border-red-500" : ""}
                    placeholder="Enter subtitle in Arabic"
                  />
                )}
              />
              {errors.subTitle?.ar && (
                <p className="text-xs text-red-500 mt-1">
                  {t(errors.subTitle.ar.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="block text-sm font-medium">
              {t("Statistics")}
            </Label>
            <button
              type="button"
              onClick={addStatistic}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t("Add Statistic")}
            </button>
          </div>

          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded-md">
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
                        {t("Name (English)")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`statics.${index}.name.en`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.statics?.[index]?.name?.en
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter name in English"
                          />
                        )}
                      />
                      {errors.statics?.[index]?.name?.en && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.statics[index]?.name?.en?.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Name (Arabic)")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`statics.${index}.name.ar`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.statics?.[index]?.name?.ar
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter name in Arabic"
                          />
                        )}
                      />
                      {errors.statics?.[index]?.name?.ar && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.statics[index]?.name?.ar?.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Statistic Count */}
                  <div className="mb-4">
                    <Label className="block text-xs text-gray-500 mb-1">
                      {t("Count")} <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name={`statics.${index}.count`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={
                            errors.statics?.[index]?.count
                              ? "border-red-500"
                              : ""
                          }
                          placeholder="Enter count (e.g., 450+, 45%)"
                        />
                      )}
                    />
                    {errors.statics?.[index]?.count && (
                      <p className="text-xs text-red-500 mt-1">
                        {t(errors.statics[index]?.count?.message)}
                      </p>
                    )}
                  </div>

                  {/* Statistic Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Description (English)")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`statics.${index}.desc.en`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.statics?.[index]?.desc?.en
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter description in English"
                          />
                        )}
                      />
                      {errors.statics?.[index]?.desc?.en && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.statics[index]?.desc?.en?.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Description (Arabic)")} <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`statics.${index}.desc.ar`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.statics?.[index]?.desc?.ar
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter description in Arabic"
                          />
                        )}
                      />
                      {errors.statics?.[index]?.desc?.ar && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.statics[index]?.desc?.ar?.message)}
                        </p>
                      )}
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
  }
);

ImpactSection.displayName = "ImpactSection";

export default ImpactSection;