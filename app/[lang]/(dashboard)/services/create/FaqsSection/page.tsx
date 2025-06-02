import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";

interface FaqItem {
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
}

interface FaqsData {
  title: {
    en: string;
    ar: string;
  };
  subTitle: {
    en: string;
    ar: string;
  };
  list: FaqItem[];
}

interface FaqsSectionProps {
  faqs: FaqsData;
  setService: React.Dispatch<React.SetStateAction<any>>;
  lang: "en" | "ar";
}

const FaqsSection: React.FC<FaqsSectionProps> = ({
  faqs,
  setService,
  lang,
}) => {
  const { t } = useTranslate();

  // Initialize faqs with empty values if undefined
  const safeFaqs = faqs || {
    title: { en: "", ar: "" },
    subTitle: { en: "", ar: "" },
    list: [],
  };

  // Handle bilingual field changes
  const handleBilingualChange = (
    field: keyof FaqsData,
    subField: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        [field]: {
          ...prev.faqs[field],
          [subField]: value,
        },
      },
    }));
  };

  // Handle FAQ item changes
  const handleFaqItemChange = (
    index: number,
    field: "question" | "answer",
    subField: "en" | "ar",
    value: string
  ) => {
    setService((prev: any) => {
      const updatedFaqs = [...prev.faqs.list];
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        [field]: {
          ...updatedFaqs[index][field],
          [subField]: value,
        },
      };
      return {
        ...prev,
        faqs: {
          ...prev.faqs,
          list: updatedFaqs,
        },
      };
    });
  };

  // Add new FAQ item
  const addFaqItem = () => {
    setService((prev: any) => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        list: [
          ...prev.faqs.list,
          {
            question: { en: "", ar: "" },
            answer: { en: "", ar: "" },
          },
        ],
      },
    }));
  };

  // Remove FAQ item
  const removeFaqItem = (index: number) => {
    setService((prev: any) => {
      const updatedFaqs = [...prev.faqs.list];
      updatedFaqs.splice(index, 1);
      return {
        ...prev,
        faqs: {
          ...prev.faqs,
          list: updatedFaqs,
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
              value={safeFaqs.title.en}
              onChange={(e) =>
                handleBilingualChange("title", "en", e.target.value)
              }
              placeholder="Enter title in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeFaqs.title.ar}
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
              value={safeFaqs.subTitle.en}
              onChange={(e) =>
                handleBilingualChange("subTitle", "en", e.target.value)
              }
              placeholder="Enter subtitle in English"
            />
          </div>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">Arabic</Label>
            <Input
              value={safeFaqs.subTitle.ar}
              onChange={(e) =>
                handleBilingualChange("subTitle", "ar", e.target.value)
              }
              placeholder="Enter subtitle in Arabic"
            />
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

        {safeFaqs.list.length > 0 ? (
          <div className="space-y-4">
            {safeFaqs.list.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md">
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
                      Question (English)
                    </Label>
                    <Input
                      value={faq.question.en}
                      onChange={(e) =>
                        handleFaqItemChange(
                          index,
                          "question",
                          "en",
                          e.target.value
                        )
                      }
                      placeholder="Enter question in English"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Question (Arabic)
                    </Label>
                    <Input
                      value={faq.question.ar}
                      onChange={(e) =>
                        handleFaqItemChange(
                          index,
                          "question",
                          "ar",
                          e.target.value
                        )
                      }
                      placeholder="Enter question in Arabic"
                    />
                  </div>
                </div>

                {/* Answer Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Answer (English)
                    </Label>
                    <Input
                      value={faq.answer.en}
                      onChange={(e) =>
                        handleFaqItemChange(
                          index,
                          "answer",
                          "en",
                          e.target.value
                        )
                      }
                      placeholder="Enter answer in English"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Answer (Arabic)
                    </Label>
                    <Input
                      value={faq.answer.ar}
                      onChange={(e) =>
                        handleFaqItemChange(
                          index,
                          "answer",
                          "ar",
                          e.target.value
                        )
                      }
                      placeholder="Enter answer in Arabic"
                    />
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
};

export default FaqsSection;
