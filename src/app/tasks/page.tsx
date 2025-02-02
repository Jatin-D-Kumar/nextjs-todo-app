"use client";

import ActionMenu from "@/components/ActionMenu";
import SearchBar from "@/components/SearchBar";
import TaskList from "@/components/TaskList";
import useDebounce from "@/hooks/useDebounce"; // Importing the custom debounce hook
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TasksPage = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session }: any = useSession();

  // Use the custom debounce hook for searchQuery
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce for 500ms

  const handleAddTask = () => {
    router.push("/tasks/add");
  };

  const handleBulkRemoveCompleted = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/getAll`, // Fetch completed tasks only
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasks = await res.json();

      const deletePromises = tasks
        .filter((task: any) => task.status)
        .map((task: { _id: string }) => {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/todo/delete?id=${task._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session?.user?.token}`,
              },
            }
          );
        });

      await Promise.all(deletePromises);

      console.log("Bulk remove completed tasks");
    } catch (error) {
      console.error("Error removing completed tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Your Tasks
        </h1>
        <SearchBar onSearch={handleSearchChange} />
        <ActionMenu
          filter={filter}
          onFilterChange={setFilter}
          onAddTask={handleAddTask}
          onBulkRemoveCompleted={handleBulkRemoveCompleted}
        />

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TaskList filter={filter} searchQuery={debouncedSearchQuery} />
        )}
      </div>
    </div>
  );
};

export default TasksPage;
