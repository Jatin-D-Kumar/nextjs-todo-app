import type React from "react";
import type { ChangeEvent } from "react";

interface SearchBarProps {
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search tasks..."
      onChange={onSearch}
      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    />
  );
};

export default SearchBar;
