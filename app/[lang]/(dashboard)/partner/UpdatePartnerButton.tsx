import React, { useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdatePartners } from "@/services/partner/partner";

interface UpdateButtonProps {
  partner: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdatePartnerButton = ({ partner, flag, setFlag }: UpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <UpdateButton
      entityName="Partner"
      initialData={{
        nameEn: "",
        nameAr: "",
        logo_alt: "",
        website_url: "",
        logo: null,
      }}
      currentData={{
        nameEn: partner.name.en,
        nameAr: partner.name.ar,
        logo_alt: partner.logo_alt,
        website_url: partner.website_url,
        logo: partner.logo_url,
      }}
      fields={[
        {
          name: "logo",
          label: "Partner Image",
          type: "image",
          tab: "English",
          required: true,
          validation: {
            message: "Partner Logo Is Required",
          },
        },
        {
          name: "logo_alt",
          label: "Logo Alternative Text",
          type: "alt_text",
          tab: "English",
          required: true,
          validation: {
            minLength: 3,
            maxLength: 100,
            message: "Alt text must be between 3-100 characters",
          },
        },
        {
          name: "nameEn",
          label: "Partner Name",
          type: "text",
          tab: "English",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "nameAr",
          label: "Partner Name",
          type: "text",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "website_url",
          label: "Website URL",
          type: "alt_text",
          tab: "English",
          validation: {
            url: true,
            message: "Please enter a valid URL",
          },
        },
      ]}
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
        return await UpdatePartners(formData, id, lang);
      }}
      setFlag={setFlag}
      flag={flag}
      setOpen={setOpen}
      open={open}
      itemId={partner.id}
    />
  );
};

export default UpdatePartnerButton;
