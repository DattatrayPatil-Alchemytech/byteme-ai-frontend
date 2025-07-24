import * as React from 'react';
import { Select } from './DropdownMenu';

interface SearchFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  filterLabel: string;
  filterValue: string;
  filterOptions: string[];
  onFilterChange: (val: string) => void;
}

export function SearchFilter({
  search,
  onSearchChange,
  filterLabel,
  filterValue,
  filterOptions,
  onFilterChange,
}: SearchFilterProps) {
  const selectOptions = [{ value: '', label: `All ${filterLabel}s` }, ...filterOptions.map(opt => ({ value: opt, label: opt }))];
  return (
    <div className="flex gap-2 items-center w-full max-w-xl">
      <input
        placeholder="Search..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="border rounded-full px-4 py-2 w-full shadow focus:ring-2 focus:ring-primary outline-none"
      />
      <Select
        options={selectOptions}
        value={filterValue}
        onChange={onFilterChange}
        placeholder={filterLabel}
        className="min-w-[120px]"
      />
    </div>
  );
} 