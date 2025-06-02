import { useState } from "react";

export const hookRetaailers = ()=>{


	const [selectedLanguage, setSelectedLanguage] = useState("English");

  // State to store form data for both languages
  const [formData, setFormData] = useState<any>({
    English: { name: "", status: "" },
    Arabic: { name: "", status: "" },
  });

  // Handler for updating input fields
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevData:any) => ({
      ...prevData,
      [selectedLanguage]: {
        ...prevData[selectedLanguage],
        [name]: value,
      },
    }));
  };

  // Handler for updating radio status
  const handleStatusChange = (status:any) => {
    setFormData((prevData:any) => ({
      ...prevData,
      [selectedLanguage]: {  ...prevData[selectedLanguage], status,
      },
    }));
  };

  // Handler for form submission
  const handleSubmit = () => {
    const payload = {
      English: formData.English,
      Arabic: formData.Arabic,
    };
    console.log("Submitting data to backend:", payload);
  };


  return {formData , setSelectedLanguage , selectedLanguage , handleInputChange , handleStatusChange , handleSubmit }
}