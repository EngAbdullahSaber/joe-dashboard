"use client";

import React, {
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
const faqsSchema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required").max(100),
    ar: z.string().min(1, "Arabic title is required").max(100),
  }),
  subTitle: z.object({
    en: z.string().min(1, "English subtitle is required").max(150),
    ar: z.string().min(1, "Arabic subtitle is required").max(150),
  }),
  list: z.array(
    z.object({
      question: z.object({
        en: z.string().min(1, "English question is required").max(200),
        ar: z.string().min(1, "Arabic question is required").max(200),
      }),
      answer: z.object({
        en: z.string().min(1, "English answer is required").max(500),
        ar: z.string().min(1, "Arabic answer is required").max(500),
      }),
    })
  ),
});

type FaqsFormData = z.infer<typeof faqsSchema>;

interface FaqsSectionProps {
  faqs: FaqsFormData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

export interface FaqsSectionRef {
  validateForm: () => Promise<boolean>;
}

const FaqsSection = forwardRef<FaqsSectionRef, FaqsSectionProps>(
  ({ faqs, setService, lang }, ref) => {
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
    } = useForm<FaqsFormData>({
      resolver: zodResolver(faqsSchema),
      defaultValues: {
        title: faqs?.title || { en: "", ar: "" },
        subTitle: faqs?.subTitle || { en: "", ar: "" },
        list: faqs?.list || [],
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "list",
    });

    // Watch for form changes to sync with parent state
    const watchedValues = watch();

    // Sync form values with parent service prop when it changes
    useEffect(() => {
      reset({
        title: faqs?.title || { en: "", ar: "" },
        subTitle: faqs?.subTitle || { en: "", ar: "" },
        list: faqs?.list || [],
      });
      setIsLoading(false);
    }, [faqs, reset]);

    // Expose validation method to parent component
    useImperativeHandle(
      ref,
      () => ({
        validateForm: async () => {
          const isValid = await trigger();
          if (isValid) {
            setService((prev: any) => ({
              ...prev,
              faqs: getValues(),
            }));
          }
          return isValid;
        },
      }),
      [trigger, getValues, setService]
    );

    // Add new FAQ item
    const addFaqItem = () => {
      append({
        question: { en: "", ar: "" },
        answer: { en: "", ar: "" },
      });
    };

    // Remove FAQ item
    const removeFaqItem = (index: number) => {
      remove(index);
    };

    if (isLoading) {
      return <Loader2 className="h-6 w-6 animate-spin" />;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("FAQs Section")}</h2>
          <p className="text-gray-600 mb-6">
            {t("Configure frequently asked questions for your service")}
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

        {/* FAQ List Section */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label className="block text-sm font-medium">{t("FAQs")}</Label>
            <button
              type="button"
              onClick={addFaqItem}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t("Add FAQ")}
            </button>
          </div>

          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-sm font-medium">
                      {t("FAQ")} #{index + 1}
                    </Label>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      {t("Remove")}
                    </button>
                  </div>

                  {/* Question Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Question (English)")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`list.${index}.question.en`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.list?.[index]?.question?.en
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter question in English"
                          />
                        )}
                      />
                      {errors.list?.[index]?.question?.en && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.list[index]?.question?.en?.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Question (Arabic)")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`list.${index}.question.ar`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.list?.[index]?.question?.ar
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter question in Arabic"
                          />
                        )}
                      />
                      {errors.list?.[index]?.question?.ar && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.list[index]?.question?.ar?.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Answer Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Answer (English)")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`list.${index}.answer.en`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.list?.[index]?.answer?.en
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter answer in English"
                          />
                        )}
                      />
                      {errors.list?.[index]?.answer?.en && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.list[index]?.answer?.en?.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-xs text-gray-500 mb-1">
                        {t("Answer (Arabic)")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name={`list.${index}.answer.ar`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className={
                              errors.list?.[index]?.answer?.ar
                                ? "border-red-500"
                                : ""
                            }
                            placeholder="Enter answer in Arabic"
                          />
                        )}
                      />
                      {errors.list?.[index]?.answer?.ar && (
                        <p className="text-xs text-red-500 mt-1">
                          {t(errors.list[index]?.answer?.ar?.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t("No FAQs added yet")}</p>
          )}
        </div>
      </div>
    );
  }
);

FaqsSection.displayName = "FaqsSection";

export default FaqsSection;
