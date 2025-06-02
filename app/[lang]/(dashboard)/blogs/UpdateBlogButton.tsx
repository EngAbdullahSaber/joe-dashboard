import React, { useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdateBlogs } from "@/services/blog/blog";

interface UpdateButtonProps {
  blog: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateBlogButton = ({ blog, flag, setFlag }: UpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <UpdateButton
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
        image_url: null,
      }}
      fields={[
        {
          name: "image_url",
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
      currentData={{
        titleEn: blog.title.en,
        titleAr: blog.title.ar,
        contentEn: blog.content.en,
        contentAr: blog.content.ar,
        meta_titleEn: blog.meta_title.en,
        meta_titleAr: blog.meta_title.ar,
        meta_descriptionEn: blog.meta_description.en,
        meta_descriptionAr: blog.meta_description.ar,
        meta_keywordsEn: blog.meta_keywords.en,
        meta_keywordsAr: blog.meta_keywords.ar,
        image_alt: blog.image_alt,
        slug: blog.slug,
        type_blog: blog.type_blog,
        image_url: blog.image_url,
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
        return await UpdateBlogs(formData, id, lang);
      }}
      setFlag={setFlag}
      flag={flag}
      setOpen={setOpen}
      open={open}
      itemId={blog.id}
    />
  );
};

export default UpdateBlogButton;
