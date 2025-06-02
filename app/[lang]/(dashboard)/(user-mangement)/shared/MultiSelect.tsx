import Select from "react-select";
interface OptionType {
  value: string;
  label: string;
  isFixed?: boolean;
  icon?: string;
}

const fruits: OptionType[] = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "orange", label: "Orange" },
  { value: "apple", label: "Apple" },
];

const styles = {
  multiValue: (base: any, state: any) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base: any, state: any) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base: any, state: any) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const MultiSelect = () => {
  return (
    <div>
      <Select
        isClearable={false}
        defaultValue={[fruits[2], fruits[3]]}
        styles={styles}
        isMulti
        name="colors"
        options={fruits}
        className="react-select"
        classNamePrefix="select"
      />
    </div>
  );
};

export default MultiSelect;
