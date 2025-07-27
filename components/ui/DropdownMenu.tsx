import React, { useState, useRef, useEffect } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value) || {
    label: placeholder,
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`relative w-full sm:w-64 max-w-full`} ref={menuRef}>
      <button
        type="button"
        className="flex items-center justify-between border border-primary/30 rounded-full py-3 px-5 w-full bg-card/90 text-base font-medium shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:ring-2 hover:ring-primary/30 hover:bg-primary/5"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {selected.label}
        </span>
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div
          className="absolute left-0 z-20 mt-2 w-full rounded-2xl bg-card/95 shadow-xl border border-primary/10 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in"
          role="listbox"
          tabIndex={-1}
        >
          {placeholder && (
            <div
              className={`px-4 py-2 cursor-pointer text-muted-foreground transition-all duration-200 rounded ${
                value === ""
                  ? "bg-primary/20 text-primary font-semibold"
                  : "hover:bg-muted hover:text-primary focus:bg-muted focus:text-primary"
              }`}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              role="option"
              aria-selected={value === ""}
              tabIndex={0}
            >
              {placeholder}
            </div>
          )}
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2 cursor-pointer text-base font-medium rounded transition-all duration-200 ${
                value === opt.value
                  ? "bg-primary/20 text-primary font-semibold"
                  : "hover:bg-muted hover:text-primary focus:bg-muted focus:text-primary text-foreground"
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={value === opt.value}
              tabIndex={0}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
