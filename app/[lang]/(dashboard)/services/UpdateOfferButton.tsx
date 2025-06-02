import React, { useEffect, useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import {
  getAllDepatment,
  getDepatment,
} from "@/services/departments/departments";
import { useParams } from "next/navigation";
import { UpdateOfferss } from "@/services/offers/offers";

interface UpdateButtonProps {
  offer: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateOfferButton = ({ offer, flag, setFlag }: UpdateButtonProps) => {
  const [departments, setDepartment] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { lang } = useParams();

  const transformedDepartments = departments.map((item) => ({
    id: item.id,
    value: lang == "en" ? item.name.en : item.name.ar,
    label: lang == "en" ? item.name.en : item.name.ar,
  }));
  const fetchData = async () => {
    try {
      const departmentData = await getAllDepatment(lang);
      setDepartment(departmentData?.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);
  return (
    <UpdateButton
      entityName="Offer"
      initialData={{
        nameEn: "",
        nameAr: "",
        priceAfterOffers: null,
        price: null,
        image_alt: "",
        meta_titleEn: "",
        meta_titleAr: "",
        meta_descriptionEn: "",
        meta_descriptionAr: "",
        meta_keywordsEn: "",
        meta_keywordsAr: "",
        department_id: "",
        file: null,
      }}
      fields={[
        {
          name: "file",
          label: "Offer Image",
          type: "image",
          tab: "English",
          required: true,
          validation: {
            message: "Offer Image Is Required",
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
          name: "priceAfterOffers",
          label: "Price After Offers",
          type: "number",
          tab: "English",
          required: true,
        },
        {
          name: "department_id",
          label: "department",
          type: "select",
          tab: "English",
          options: transformedDepartments,
          required: true,
        },
        {
          name: "price",
          label: "Offer Price",
          type: "number",
          tab: "English",
          required: true,
        },
        {
          name: "nameEn",
          label: "Offer Name",
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
          label: "Offer Name",
          type: "text",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "meta_titleEn",
          label: "Offer Meta Title",
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
          label: "Offer Meta Title",
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
          label: "Offer Meta Description",
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
          label: "Offer Meta Description",
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
          label: "Offer Meta Keywords",
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
          label: "Offer Meta Keywords",
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
        nameEn: offer.name.en,
        nameAr: offer.name.ar,
        priceAfterOffers: offer.priceAfterOffers,
        price: offer.price,
        image_alt: offer.image_alt,
        meta_titleEn: offer.meta_title.en,
        meta_titleAr: offer.meta_title.ar,
        meta_descriptionEn: offer.meta_description.en,
        meta_descriptionAr: offer.meta_description.ar,
        meta_keywordsEn: offer.meta_keywords.en,
        meta_keywordsAr: offer.meta_keywords.ar,
        department_id: offer?.department?.id,

        file: offer.image_url,
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
        return await UpdateOfferss(formData, id, lang);
      }}
      setFlag={setFlag}
      setOpen={setOpen}
      open={open}
      flag={flag}
      itemId={offer.id}
    />
  );
};

export default UpdateOfferButton;
