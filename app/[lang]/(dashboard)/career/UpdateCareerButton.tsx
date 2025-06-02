import React, { useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdateCareers } from "@/services/career/career";

interface UpdateButtonProps {
  career: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateCareerButton = ({ career, flag, setFlag }: UpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <UpdateButton
      entityName="Career"
      initialData={{
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        requirmentsEn: "",
        requirmentsAr: "",
        benefitsEn: "",
        benefitsAr: "",
        meta_titleEn: "",
        meta_titleAr: "",
        meta_descriptionEn: "",
        meta_descriptionAr: "",
        meta_keywordsEn: "",
        meta_keywordsAr: "",
        image_alt: "",
        file: null,
      }}
      currentData={{
        titleEn: career.title.en,
        titleAr: career.title.ar,
        descriptionEn: career.description.en,
        descriptionAr: career.description.ar,
        requirmentsEn: career.requirments.en,
        requirmentsAr: career.requirments.ar,
        benefitsEn: career.benefits.en,
        benefitsAr: career.benefits.ar,
        meta_titleEn: career.meta_title.en,
        meta_titleAr: career.meta_title.ar,
        meta_descriptionEn: career.meta_description.en,
        meta_descriptionAr: career.meta_description.ar,
        meta_keywordsEn: career.meta_keywords.en,
        meta_keywordsAr: career.meta_keywords.ar,
        image_alt: career.image_alt,
        file: career.image_url,
      }}
      fields={[
        {
          name: "file",
          label: "Career Image",
          type: "image",
          tab: "English",
          required: true,
          validation: {
            message: "Career Image Is Required",
          },
        },
        {
          name: "image_alt",
          label: "Image Alternative Text",
          type: "alt_text",
          tab: "English",
          validation: {
            minLength: 3,
            maxLength: 100,
            message: "Alt text must be between 3-100 characters",
          },
        },
        {
          name: "titleEn",
          label: "Career Title",
          type: "text",
          tab: "English",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "titleAr",
          label: "Career Title",
          type: "text",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "descriptionEn",
          label: "Career Description",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "descriptionAr",
          label: "Career Description",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "requirmentsEn",
          label: "Career Requirments",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "requirmentsAr",
          label: "Career Requirments",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "benefitsEn",
          label: "Career Benefits",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "benefitsAr",
          label: "Career Benefits",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_titleEn",
          label: "Career Meta Title",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_titleAr",
          label: "Career Meta Title",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_descriptionEn",
          label: "Career Meta Description",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_descriptionAr",
          label: "Career Meta Description",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_keywordsEn",
          label: "Career Meta Keywords",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "meta_keywordsAr",
          label: "Career Meta Keywords",
          type: "textarea",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
      ]}
      // Modify your onUpdate handler in UpdateCareerButton
      onUpdate={async (changedData, id, lang) => {
        const formData = new FormData();

        // Handle nested objects (title.en, title.ar, etc.)
        const nestedFields = [
          "title",
          "description",
          "requirments",
          "benefits",
          "meta_title",
          "meta_description",
          "meta_keywords",
        ];

        Object.entries(changedData).forEach(([key, value]) => {
          if (value !== null) {
            // Check if this is a nested field (like titleEn -> title.en)
            const isNested = nestedFields.some((field) =>
              key.startsWith(field)
            );

            if (isNested) {
              const match = key.match(/^(.*)(En|Ar)$/);
              if (match) {
                const base = match[1];
                const lang = match[2].toLowerCase();
                formData.append(`${base}[${lang}]`, value as string | Blob);
              }
            } else {
              // Regular field
              formData.append(key, value as string | Blob);
            }
          }
        });

        return await UpdateCareers(formData, id, lang);
      }}
      setFlag={setFlag}
      flag={flag}
      setOpen={setOpen}
      open={open}
      itemId={career.id}
    />
  );
};

export default UpdateCareerButton;
