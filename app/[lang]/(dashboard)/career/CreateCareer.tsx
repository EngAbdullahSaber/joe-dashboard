import React from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateCareers } from "@/services/career/career";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateCareer = ({ flag, setFlag }: CreateButtonProps) => {
  return (
    <div>
      <CreateButton
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
        onCreate={async (data, lang) => {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
              const match = key.match(/^(.*)(En|Ar)$/); // Check if key ends in En or Ar
              if (match) {
                const base = match[1]; // e.g., "description", "bio", "meta_title"
                const lang = match[2].toLowerCase(); // "en" or "ar"
                formData.append(`${base}[${lang}]`, value as string | Blob);
              } else {
                formData.append(key, value as string | Blob);
              }
            }
          });
          return await CreateCareers(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateCareer;
