import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface FilterField {
  name: string;
  label: string;
  type:
    | "select"
    | "multiselect"
    | "date"
    | "daterange"
    | "input"
    | "number"
    | "checkbox"
    | "radio";
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
  icon?: string;
  className?: string;
}

interface GenericFilterProps {
  fields: FilterField[];
  onFilter: (filters: Record<string, any>) => void;
  onReset?: () => void;
  initialFilters?: Record<string, any>;
  title?: string;
  description?: string;
  icon?: string;
  showActiveFiltersCount?: boolean;
}

const GenericFilter: React.FC<GenericFilterProps> = ({
  fields,
  onFilter,
  onReset,
  initialFilters = {},
  title = "Advanced Filters",
  description = "Apply filters to refine your search results",
  icon = "heroicons:funnel",
  showActiveFiltersCount = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [openSelects, setOpenSelects] = useState<Record<string, boolean>>({});

  // Calculate active filters count
  React.useEffect(() => {
    const count = Object.values(filters).filter(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchTermChange = (fieldName: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, any>);

    setFilters(resetFilters);
    setSearchTerms({});
    onFilter(resetFilters);
    if (onReset) onReset();
  };

  const renderFilterField = (field: FilterField) => {
    const value = filters[field.name] || field.defaultValue || "";
    const searchTerm = searchTerms[field.name] || "";

    switch (field.type) {
      case "input":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              {field.icon && (
                <Icon
                  icon={field.icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />
              )}
              <input
                type="text"
                value={value}
                onChange={(e) => handleFilterChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full ${
                  field.icon ? "pl-10" : "pl-4"
                } pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white`}
              />
            </div>
          </div>
        );

      case "number":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              {field.icon && (
                <Icon
                  icon={field.icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                />
              )}
              <input
                type="number"
                value={value}
                onChange={(e) => handleFilterChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full ${
                  field.icon ? "pl-10" : "pl-4"
                } pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white`}
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            {/* Label */}
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {field.label}
              {field.label && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Custom Select Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const newOpenState = !openSelects[field.name];
                  setOpenSelects({
                    ...openSelects,
                    [field.name]: newOpenState,
                  });
                }}
                className={`
            w-full px-4 py-3.5 
            bg-slate-50 dark:bg-slate-900 
            border-2 transition-all duration-300
            rounded-xl text-left
            flex items-center justify-between gap-3
            ${
              openSelects[field.name]
                ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30"
                : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
            }
            ${
              !value
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-900 dark:text-white"
            }
            hover:shadow-md
          `}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {field.icon && (
                    <Icon
                      icon={field.icon}
                      className={`w-5 h-5 flex-shrink-0 ${
                        value
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-slate-400"
                      }`}
                    />
                  )}
                  <span className="truncate font-medium">
                    {field.options?.find((opt) => opt.value === value)?.label ||
                      field.placeholder ||
                      "Select..."}
                  </span>
                </div>

                <div className="flex items-center jus gap-2 flex-shrink-0">
                  {value && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange(field.name, "");
                        handleSearchTermChange(field.name, "");
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                      <Icon
                        icon="heroicons:x-mark"
                        className="w-4 h-4 text-slate-400"
                      />
                    </button>
                  )}
                  <Icon
                    icon="heroicons:chevron-down"
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      openSelects[field.name] ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {openSelects[field.name] && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                  {/* Search Input */}
                  <div className="p-3 border-b-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="relative">
                      <Icon
                        icon="heroicons:magnifying-glass"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        placeholder="Search options..."
                        value={searchTerms[field.name] || ""}
                        onChange={(e) =>
                          handleSearchTermChange(field.name, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-slate-900 dark:text-white text-sm transition-all"
                      />
                      {searchTerms[field.name] && (
                        <button
                          type="button"
                          onClick={() => handleSearchTermChange(field.name, "")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                          <Icon
                            icon="heroicons:x-mark"
                            className="w-3 h-3 text-slate-400"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {(() => {
                      const searchTerm = searchTerms[field.name] || "";
                      const filtered = field.options?.filter(
                        (option) =>
                          option.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          option.value
                            .toString()
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      );

                      return filtered && filtered.length > 0 ? (
                        filtered.map((option) => {
                          const isSelected = value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handleFilterChange(field.name, option.value);
                                setOpenSelects({
                                  ...openSelects,
                                  [field.name]: false,
                                });
                                handleSearchTermChange(field.name, "");
                              }}
                              className={`
                          w-full px-4 py-3 text-left flex items-center justify-between gap-3
                          transition-all duration-200
                          border-b border-slate-100 dark:border-slate-700 last:border-b-0
                          ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 dark:hover:from-slate-700/50 dark:hover:to-blue-900/20"
                          }
                        `}
                            >
                              <span className="truncate">{option.label}</span>
                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <div className="w-5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                                    <Icon
                                      icon="heroicons:check"
                                      className="w-3 h-3 text-white"
                                    />
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <div className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            No results found
                          </div>
                          {searchTerm && (
                            <div className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                              Try a different search term
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Helper Text */}
            {value && field.options?.find((opt) => opt.value === value) && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                <Icon
                  icon="heroicons:check"
                  className="w-3 h-3 text-green-500"
                />
              </p>
            )}
          </div>
        );

      case "multiselect":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-h-40 overflow-y-auto">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      Array.isArray(value)
                        ? value.includes(option.value)
                        : false
                    }
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);
                      handleFilterChange(field.name, newValues);
                    }}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              <Icon
                icon="heroicons:calendar"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              />
              <input
                type="date"
                value={value}
                onChange={(e) => handleFilterChange(field.name, e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
        );

      case "daterange":
        const [startDate, endDate] = Array.isArray(value) ? value : ["", ""];
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Icon
                  icon="heroicons:calendar"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    handleFilterChange(field.name, [e.target.value, endDate])
                  }
                  placeholder="Start Date"
                  className="w-full pl-10 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div className="relative">
                <Icon
                  icon="heroicons:calendar"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    handleFilterChange(field.name, [startDate, e.target.value])
                  }
                  placeholder="End Date"
                  className="w-full pl-10 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handleFilterChange(field.name, e.target.checked)
                }
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {field.label}
              </span>
            </label>
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className={field.className || "w-full"}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) =>
                      handleFilterChange(field.name, e.target.value)
                    }
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Icon icon={icon} className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showActiveFiltersCount && activeFiltersCount > 0 && (
            <Badge className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {activeFiltersCount} active
            </Badge>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              icon="heroicons:chevron-down"
              className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors"
            />
          </motion.div>
        </div>
      </button>

      {/* Collapsible Filter Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mt-4 p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
              {/* Filter Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {fields.map((field) => renderFilterField(field))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  type="button"
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                >
                  <Icon icon="heroicons:check" className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenericFilter;
