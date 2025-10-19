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
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

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
    onFilter(resetFilters);
    if (onReset) onReset();
  };

  const renderFilterField = (field: FilterField) => {
    const value = filters[field.name] || field.defaultValue || "";

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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
            </label>
            <div className="relative">
              {field.icon && (
                <Icon
                  icon={field.icon}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10"
                />
              )}
              <select
                value={value}
                onChange={(e) => handleFilterChange(field.name, e.target.value)}
                className={`w-full ${
                  field.icon ? "pl-10" : "pl-4"
                } pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-slate-900 dark:text-white cursor-pointer`}
              >
                <option value="">{field.placeholder || "Select..."}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon
                icon="heroicons:chevron-down"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              />
            </div>
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
            className="overflow-hidden"
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
