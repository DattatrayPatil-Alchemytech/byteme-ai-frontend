import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}) => {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`border rounded py-2 px-3 w-full sm:w-64 max-w-full focus:ring-2 focus:ring-primary/30 transition ${className}`}
      size={1}
      style={{ height: 48 }}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}; 