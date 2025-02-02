import Link from "next/link";
import type React from "react";

interface ActionMenuProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  onAddTask: () => void;
  onBulkRemoveCompleted: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  filter,
  onFilterChange,
  onAddTask,
  onBulkRemoveCompleted,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-x-2">
        <button
          onClick={() => onFilterChange("All")}
          className={`px-3 py-1 rounded-md ${
            filter === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("Active")}
          className={`px-3 py-1 rounded-md ${
            filter === "Active"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange("Completed")}
          className={`px-3 py-1 rounded-md ${
            filter === "Completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Completed
        </button>
      </div>
      <div className="space-x-2">
        <button
          onClick={onAddTask}
          className="px-3 py-1 rounded-md bg-green-500 text-white"
        >
          Add Task
        </button>
        <button
          onClick={onBulkRemoveCompleted}
          className="px-3 py-1 rounded-md bg-red-500 text-white"
        >
          Remove Completed
        </button>
        <Link
          href="/statistics"
          className="bg-blue-500 text-white p-3 px-6 rounded-full hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg"
        >
          View Statistics
        </Link>
      </div>
    </div>
  );
};

export default ActionMenu;
