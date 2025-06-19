import React from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateMedia } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { apis } from "@/services/axios";

interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const CreatePartner = ({ flag, setFlag }: CreateButtonProps) => {
  const { t } = useTranslate();

  return (
    <div>
      <CreateButton
        entityName="Partner"
        initialData={{
          logo_alt: "",
          file: null,
        }}
        fields={[
          {
            name: "file",
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
            label: "Image Alt Text",
            type: "text",
            tab: "English",
            required: true,
          },
        ]}
        onCreate={async (data, lang) => {
          try {
            // 1. Upload the image first
            const formData = new FormData();
            formData.append("files", data.file);
            formData.append("alt[0]", data.logo_alt || "");

            const imageResponse = await CreateMedia(formData, lang);
            const newImage = imageResponse[0];

            // 2. Get current partners list
            const currentPage = await apis.get(`api/v1/pages/home-page`, {
              headers: { "Accept-Language": lang },
            });

            const sec3 = currentPage.data.sections.find(
              (s: any) => s.id === "sec3"
            );
            const currentList = sec3?.list || [];

            // 3. Create new partner object
            const newPartner = {
              alt: data.logo_alt,
              url: newImage.url, // Assuming CreateMedia returns the uploaded image info
            };

            // 4. Update the section with the new list
            const updatedList = [...currentList, newPartner];

            const res = await apis.put(
              `api/v1/pages/45/sections/sec3`,
              {
                list: updatedList,
              },
              {
                headers: {
                  "Accept-Language": lang,
                  "content-type": "application/json",
                },
              }
            );

            setFlag(!flag);
            return res.data;
          } catch (error) {
            console.error("Error creating partner:", error);
            reToast.error(t("Failed to add partner"));
            throw error;
          }
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreatePartner;
