import React, { useEffect, useState } from "react";
import UpdateButton from "../(user-mangement)/shared/UpdateButton";
import { UpdateBlogs } from "@/services/blog/blog";
import { useParams } from "next/navigation";
import { getAllDepatment } from "@/services/departments/departments";
import { UpdateProjects } from "@/services/projects/projects";

interface UpdateButtonProps {
  project: any; // Your partner data type
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const UpdateProjectButton = ({ project, flag, setFlag }: UpdateButtonProps) => {
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
      entityName="Project"
      initialData={{
        nameEn: "",
        nameAr: "",
        descriptionEn: "",
        descriptionAr: "",
        meta_titleEn: "",
        meta_titleAr: "",
        meta_description: "",
        slug: "",
        meta_keywords: [],
        department_id: { id: "", value: "", label: "" },
        files: [],
      }}
      fields={[
        {
          name: "files",
          label: "Project Images",
          type: "mutli_image",
          tab: "English",
          required: true,
          validation: {
            minLength: 1, // Minimum number of images
            maxLength: 5, // Maximum number of images
            minLengthAlt: 3, // Minimum length for alt text
            maxLengthAlt: 100, // Maximum length for alt text
          },
        },
        {
          name: "nameEn",
          label: "Project Name",
          type: "text",
          tab: "English",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          name: "slug",
          label: "Project Slug",
          type: "text",
          tab: "English",
          required: true,
        },
        {
          name: "nameAr",
          label: "Project Name",
          type: "text",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
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
          name: "descriptionEn",
          label: "Project Description",
          type: "textarea",
          tab: "English",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 100,
          },
        },
        {
          name: "descriptionAr",
          label: "Project Description",
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
          label: "Project Meta Title",
          type: "text",
          tab: "English",
          required: true,
          validation: {
            minLength: 5,
            maxLength: 100,
          },
        },
        {
          name: "meta_titleAr",
          label: "Project Meta Title",
          type: "text",
          tab: "Arabic",
          required: true,
          validation: {
            minLength: 5,
            maxLength: 100,
          },
        },

        {
          name: "meta_description",
          label: "Project Meta Description",
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
          label: "Project Meta Keywords",
          type: "keywords",
          tab: "English",
          required: true,
        },
      ]}
      currentData={{
        nameEn: project.name.en,
        nameAr: project.name.ar,
        descriptionEn: project.description.en,
        descriptionAr: project.description.ar,
        meta_titleAr: project.meta_title.ar,
        meta_titleEn: project.meta_title.en,
        meta_description: project.meta_description,
        slug: project.slug,
        meta_keywords: project.meta_keywords,
        department_id: {
          id: project.department.id,
          value:
            lang === "en"
              ? project.department.name.en
              : project.department.name.ar,
          label:
            lang === "en"
              ? project.department.name.en
              : project.department.name.ar,
        },
        files: project.images,
      }}
      onUpdate={async (data, id, lang) => {
        try {
          const formData = new FormData();

          // Handle language-specific fields (En/Ar fields)
          const languageFields = ["name", "description"];
          languageFields.forEach((field) => {
            if (data[`${field}En`]) {
              formData.append(`${field}[en]`, data[`${field}En`]);
            }
            if (data[`${field}Ar`]) {
              formData.append(`${field}[ar]`, data[`${field}Ar`]);
            }
          });

          if (data.files && Array.isArray(data.files)) {
            data.files.forEach((image: any, index: number) => {
              if (image.file instanceof File) {
                formData.append(`files`, image.file);
              } else if (typeof image.file === "string") {
                // Handle existing image URLs if needed
                formData.append(`files`, image.url);
              }
              formData.append(`alt[${index}]`, image.alt || "");
            });
          }
          // Handle select fields (like department_id)
          if (data.department_id?.id) {
            formData.append("department_id", data.department_id.id);
          }

          // Handle other standard fields
          const standardFields = ["slug", "meta_description", "meta_title"];
          standardFields.forEach((field) => {
            if (data[field] !== undefined && data[field] !== null) {
              formData.append(field, data[field]);
            }
          });

          // Handle array fields (like meta_keywords)
          if (Array.isArray(data.meta_keywords)) {
            data.meta_keywords.forEach((keyword: string, index: number) => {
              formData.append(`meta_keywords[${index}]`, keyword);
            });
          }

          // Log FormData for debugging
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }

          return await UpdateProjects(formData, project.id, lang);
        } catch (error) {
          console.error("Error in form submission:", error);
          throw error; // Re-throw to allow error handling in the parent component
        }
      }}
      setFlag={setFlag}
      flag={flag}
      setOpen={setOpen}
      open={open}
      itemId={project.id}
    />
  );
};

export default UpdateProjectButton;
