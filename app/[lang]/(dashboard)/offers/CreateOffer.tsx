import React, { useEffect, useState } from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateOffers } from "@/services/offers/offers";
import {
  getAllDepatment,
  getDepatment,
} from "@/services/departments/departments";
import { useParams } from "next/navigation";

interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const CreateOffer = ({ flag, setFlag }: CreateButtonProps) => {
  const [department, setDepartment] = useState<any[]>([]);
  const { lang } = useParams();

  const transformedDepartments = department.map((item) => ({
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
    fetchData();
  }, []);
  return (
    <div>
      <CreateButton
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
          department_id: null,
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
            validation: {
              message: "Department is required", // Add this
            },
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
        onCreate={async (data, lang) => {
          const formData = new FormData();

          Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
              // Handle select field (department_id)
              if (key === "department_id") {
                formData.append(key, (value as { id: string }).id);
              }
              // Handle language-specific fields
              else {
                const match = key.match(/^(.*)(En|Ar)$/);
                if (match) {
                  const base = match[1];
                  const lang = match[2].toLowerCase();
                  formData.append(`${base}[${lang}]`, value as string | Blob);
                }
                // Handle other fields
                else {
                  formData.append(key, value as string | Blob);
                }
              }
            }
          });

          return await CreateOffers(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateOffer;
