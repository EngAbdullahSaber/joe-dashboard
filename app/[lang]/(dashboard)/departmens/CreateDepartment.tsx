import React from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateDepatment } from "@/services/departments/departments";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateDepartment = ({ flag, setFlag }: CreateButtonProps) => {
  return (
    <div>
      <CreateButton
        entityName="Department"
        initialData={{
          nameEn: "",
          nameAr: "",
          descriptionEn: "",
          descriptionAr: "",
          image_alt: "",
          file: null,
        }}
        fields={[
          {
            name: "file",
            label: "Department Image",
            type: "image",
            tab: "English",
            required: true,
            validation: {
              message: "Department Logo Is Required",
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
            name: "nameEn",
            label: "Department Name",
            type: "text",
            tab: "English",
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50,
            },
          },
          {
            name: "descriptionEn",
            label: "Department Description",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 10,
              maxLength: 100,
            },
          },
          {
            name: "nameAr",
            label: "Department Name",
            type: "text",
            tab: "Arabic",
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50,
            },
          },
          {
            name: "descriptionAr",
            label: "Department Description",
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
          return await CreateDepatment(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateDepartment;
