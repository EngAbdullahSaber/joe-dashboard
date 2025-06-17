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

  const transformedStatus = [
    { id: "draft", value: "draft", label: "draft" },
    { id: "published", value: "published", label: "published" },
    { id: "archived", value: "archived", label: "archived" },
  ];
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
          tags: [],
          views_count: "",
          meta_keywords: [],
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
            type: "number",
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
            type: "select",
            options: transformedStatus,

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
            name: "meta_keywords",
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
            if (value !== null && value !== undefined) {
              // Handle special fields first
              if (key === "published_at") {
                // Ensure date is properly formatted
                const dateValue =
                  value instanceof Date ? value.toISOString() : value;
                formData.append(key, dateValue);
              } else if (key === "departmentId") {
                formData.append("departmentId", value.id);
              } else if (key === "status") {
                // Send the status value directly (not value.id)
                formData.append(key, value.id);
              } else if (key === "tags") {
                // Convert tags to array format
                if (Array.isArray(value)) {
                  value.forEach((tag, index) =>
                    formData.append(`tags[${index}]`, tag)
                  );
                } else if (typeof value === "string") {
                  value
                    .split(",")
                    .forEach((tag, index) =>
                      formData.append(`tags[${index}]`, tag.trim())
                    );
                }
              } else if (key === "meta_keywords") {
                // Convert keywords to array format
                if (Array.isArray(value)) {
                  value.forEach((keyword, index) =>
                    formData.append(`meta_keywords[${index}]`, keyword)
                  );
                } else if (typeof value === "string") {
                  value
                    .split(",")
                    .forEach((keyword, index) =>
                      formData.append(`meta_keywords[${index}]`, keyword.trim())
                    );
                }
              } else {
                // Handle language-specific fields
                const match = key.match(/^(.*)(En|Ar)$/);
                if (match) {
                  const base = match[1];
                  const langSuffix = match[2].toLowerCase();
                  formData.append(
                    `${base}[${langSuffix}]`,
                    value as string | Blob
                  );
                } else {
                  formData.append(key, value as string | Blob);
                }
              }
            }
          });

          // For debugging - log formData entries

          return await CreateBlogs(formData, lang);
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateBlog;
