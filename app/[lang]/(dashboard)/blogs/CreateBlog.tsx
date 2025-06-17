import React, { useEffect, useState } from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateBlogs } from "@/services/blog/blog";
import { getAllDepatment } from "@/services/departments/departments";
import { useParams } from "next/navigation";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateBlog = ({ flag, setFlag }: CreateButtonProps) => {
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
        entityName="Blog"
        initialData={{
          slug: "",
          titleEn: "",
          titleAr: "",
          contentEn: "",
          contentAr: "",
          meta_title: "",
          meta_description: "",
          author: "",
          status: "",
          published_at: "",
          tags: "",
          views_count: "",
          meta_keywords: "",
          image_alt: "",
          departmentId: { id: "", value: "", label: "" },
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
            name: "slug",
            label: "Blog slug",
            type: "text",
            tab: "English",
            required: true,
          },
          {
            name: "author",
            label: "Blog Author",
            type: "text",
            tab: "English",
            required: true,
          },
          {
            name: "views_count",
            label: "Blog Views Count",
            type: "text",
            tab: "English",
            required: true,
          },
          {
            name: "published_at",
            label: "Date of Publish",
            type: "date",
            tab: "English",
            required: true,
          },
          {
            name: "departmentId",
            label: "department",
            type: "select",
            tab: "English",
            options: transformedDepartments,
            required: true,
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
            name: "meta_title",
            label: "Blog Meta Title",
            type: "text",
            tab: "English",
            required: true,
          },
          {
            name: "status",
            label: "Blog Status",
            type: "text",
            tab: "English",
            required: true,
          },
          {
            name: "meta_description",
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
            name: "meta_keywordsEn",
            label: "Blog Meta Keywords",
            type: "keywords",
            tab: "English",
            required: true,
          },
          {
            name: "tags",
            label: "Blog Tags",
            type: "keywords",
            tab: "English",
            required: true,
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
          // Handle select fields (like department_id)
          if (data.department_id?.id) {
            formData.append("departmentId", data.department_id.id);
          }
          return await CreateBlogs(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateBlog;
