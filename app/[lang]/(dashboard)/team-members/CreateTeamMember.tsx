import React from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateTeamMembers } from "@/services/team/team";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateTeamMember = ({ flag, setFlag }: CreateButtonProps) => {
  return (
    <div>
      <CreateButton
        entityName="Team Member"
        initialData={{
          nameEn: "",
          nameAr: "",
          positionEn: "",
          positionAr: "",
          bioEn: "",
          bioAr: "",
          image_alt: "",
          file: null,
        }}
        fields={[
          {
            name: "file",
            label: "Team Member Image",
            type: "image",
            tab: "English",
            required: true,
            validation: {
              message: "Team Member Image Is Required",
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
            label: "Team Member Name",
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
            label: "Team Member Name",
            type: "text",
            tab: "Arabic",
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50,
            },
          },
          {
            name: "positionEn",
            label: "Team Member position",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 5,
              maxLength: 100,
            },
          },

          {
            name: "positionAr",
            label: "Team Member position",
            type: "textarea",
            tab: "Arabic",
            required: true,
            validation: {
              minLength: 5,
              maxLength: 100,
            },
          },
          {
            name: "bioEn",
            label: "Team Member Bio",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 5,
              maxLength: 150,
            },
          },

          {
            name: "bioAr",
            label: "Team Member Bio",
            type: "textarea",
            tab: "Arabic",
            required: true,
            validation: {
              minLength: 5,
              maxLength: 150,
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
          return await CreateTeamMembers(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateTeamMember;
