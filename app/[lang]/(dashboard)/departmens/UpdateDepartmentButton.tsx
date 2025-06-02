import React, { useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdateDepatments } from "@/services/departments/departments";

interface UpdateButtonProps {
  department: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateDepartmentButton = ({
  department,
  flag,
  setFlag,
}: UpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <UpdateButton
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
      currentData={{
        nameEn: department.name.en,
        nameAr: department.name.ar,
        descriptionEn: department.name.en,
        descriptionAr: department.name.ar,
        image_alt: department.image_alt,
        file: department.image_url,
      }}
      onUpdate={async (data, id, lang) => {
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
        return await UpdateDepatments(formData, id, lang);
      }}
      setFlag={setFlag}
      flag={flag}
      setOpen={setOpen}
      open={open}
      itemId={department.id}
    />
  );
};

export default UpdateDepartmentButton;
