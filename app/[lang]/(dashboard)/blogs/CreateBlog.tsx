import React from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateBlogs } from "@/services/blog/blog";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateBlog = ({ flag, setFlag }: CreateButtonProps) => {
  return (
    <div>
      <CreateButton
        entityName="Blog"
        initialData={{
          titleEn: "",
          titleAr: "",
          contentEn: "",
          contentAr: "",
          meta_titleEn: "",
          meta_titleAr: "",
          meta_descriptionEn: "",
          meta_descriptionAr: "",
          meta_keywordsEn: "",
          meta_keywordsAr: "",
          image_alt: "",
          slug: "",
          type_blog: "",
          file: null,
        }}
        fields={[
          {
            name: "file",
            label: "Blog Image",
            type: "image",
            tab: "English",
            required: true,
            validation: {
              message: "Blog Image Is Required",
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
            label: "Blog Title",
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
            label: "Blog Title",
            type: "text",
            tab: "Arabic",
            required: true,
            validation: {
              minLength: 2,
              maxLength: 50,
            },
          },
          {
            name: "type_blog",
            label: "Blog Type",
            type: "text",
            tab: "English",
            required: true,
            validation: {
              minLength: 3,
              maxLength: 100,
            },
          },
          {
            name: "slug",
            label: "Blog Slug",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 3,
              maxLength: 100,
            },
          },
          {
            name: "contentEn",
            label: "Blog Content",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 10,
              maxLength: 100,
            },
          },
          {
            name: "contentAr",
            label: "Blog Content",
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
            label: "Blog Meta Title",
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
            label: "Blog Meta Title",
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
            label: "Blog Meta Description",
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
            label: "Blog Meta Description",
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
            label: "Blog Meta Keywords",
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
            label: "Blog Meta Keywords",
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
          return await CreateBlogs(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateBlog;
