import React, { useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdateeamMembers } from "@/services/team/team";

interface UpdateButtonProps {
  teamMember: any;
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateTeamMemberButton = ({
  teamMember,
  flag,
  setFlag,
}: UpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <UpdateButton
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
      currentData={{
        nameEn: teamMember.name.en,
        nameAr: teamMember.name.ar,
        positionEn: teamMember.position.en,
        positionAr: teamMember.position.ar,
        bioEn: teamMember.bio.en,
        bioAr: teamMember.bio.ar,
        image_alt: teamMember.image_alt,
        file: teamMember.image_url,
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
        return await UpdateeamMembers(formData, id, lang);
      }}
      setFlag={setFlag}
      setOpen={setOpen}
      open={open}
      flag={flag}
      itemId={teamMember.id}
    />
  );
};

export default UpdateTeamMemberButton;
