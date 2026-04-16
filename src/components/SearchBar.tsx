"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by common name, scientific name, or family...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced propagation
  const debouncedOnChange = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => onChange(val), 250);
      };
    })(),
    [onChange]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocalValue(val);
    debouncedOnChange(val);
  }

  function handleClear() {
    setLocalValue("");
    onChange("");
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} style={{ color: "var(--color-text-muted)" }} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
          "--tw-ring-color": "var(--color-primary)",
        } as React.CSSProperties}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
          aria-label="Clear search"
        >
          <X size={16} style={{ color: "var(--color-text-muted)" }} />
        </button>
      )}
    </div>
  );
}
