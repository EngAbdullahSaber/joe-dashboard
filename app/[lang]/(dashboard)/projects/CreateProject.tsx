import React, { useEffect, useState } from "react";
import CreateButton from "../(user-mangement)/shared/CreateButton";
import { CreateBlogs } from "@/services/blog/blog";
import { CreateProjects } from "@/services/projects/projects";
import { getAllDepatment } from "@/services/departments/departments";
import { useParams } from "next/navigation";
interface CreateButtonProps {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}
const CreateProject = ({ flag, setFlag }: CreateButtonProps) => {
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
        entityName="Project"
        initialData={{
          nameEn: "",
          nameAr: "",
          descriptionEn: "",
          descriptionAr: "",
          meta_title: "",
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
            name: "meta_title",
            label: "Project Meta Title",
            type: "textarea",
            tab: "English",
            required: true,
            validation: {
              minLength: 10,
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
        onCreate={async (data: any, lang: string) => {
          try {
            const formData = new FormData();

            // Handle language-specific fields (En/Ar fields)
            const languageFields = ["name", "description", "meta_title"];
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
                  formData.append(`files`, image.file);
                }
                formData.append(`alt[${index}]`, image.alt || "");
              });
            }
            // Handle select fields (like department_id)
            if (data.department_id?.id) {
              formData.append("department_id", data.department_id.id);
            }

            // Handle other standard fields
            const standardFields = ["slug", "meta_description"];
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

            return await CreateProjects(formData, lang);
          } catch (error) {
            console.error("Error in form submission:", error);
            throw error; // Re-throw to allow error handling in the parent component
          }
        }}
        setFlag={setFlag}
        flag={flag}
      />
    </div>
  );
};

export default CreateProject;
