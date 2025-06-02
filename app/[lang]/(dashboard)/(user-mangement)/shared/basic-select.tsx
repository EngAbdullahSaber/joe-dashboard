import React, { useEffect, useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};
interface BasicSelectProps {
  menu: any[]; // Array of options passed to the select
  setSelectedValue: (selectedOption: any) => void; // Function to update selected options
  selectedValue: any; // Array of selected options
}
const BasicSelect: React.FC<BasicSelectProps> = ({
  menu,
  setSelectedValue,
  selectedValue,
}) => {
  // State to store the selected value
  const getValueById = (id: string, list: any[]) => {
    const selectedItem = list.find((item) => item.id === id);
    return selectedItem || null; // Returns the entire object or null if not found
  };
  // Handle change event to capture the selected value
  const handleChange = (selectedOption: any) => {
    console.log(selectedOption);

    setSelectedValue(selectedOption); // This will store the selected option
  };
  useEffect(() => {}, [selectedValue]);
  console.log(selectedValue);
  return (
    <div>
      {selectedValue ? (
        <Select
          className="react-select"
          classNamePrefix="select"
          styles={styles}
          defaultValue={
            typeof selectedValue === "object"
              ? selectedValue
              : getValueById(selectedValue, menu)
          }
          name="clear"
          options={menu}
          isClearable
          onChange={handleChange} // Bind the onChange handler
        />
      ) : (
        <Select
          className="react-select"
          classNamePrefix="select"
          styles={styles}
          name="clear"
          options={menu}
          isClearable
          onChange={handleChange} // Bind the onChange handler
        />
      )}
    </div>
  );
};

export default BasicSelect;
