const regionOptions = [
  { value: "for test 1", label: "For test 1" },
  { value: "for test 2", label: "For test 2" },
  { value: "for test 3", label: "For test 3" },
];

//!

export const requiredFieldsVendors = [
  { type: "input", name: "Property Name" },
  { type: "input", name: "Operating System" },
  { type: "select", name: "Occasion Type", data: regionOptions },
  { type: "select", name: "Location", data: regionOptions },
  { type: "input", name: "Overall Revenu" },
  { type: "date", name: "Join Date" },
];
export const requiredFieldsUser = [

  { type: "input", name: "UserName" },
  { type: "input", name: "Phone" },
  { type: "input", name: "Email" },
  { type: "radio", name: "Gender", data: ["male", "woman"] },
];
export const requiredFieldsProperties = [

  { type: "input", name: "title" },
  { type: "input", name: "describtion" },
  { type: "input", name: "City" },
  { type: "chooseFile", name: "Image Upload" },
];

export const requiredFieldsPackge = [

  { type: "input", name: "title" },
  { type: "input", name: "price" },
  { type: "date", name: "start date" },
  { type: "date", name: "end date" },
];