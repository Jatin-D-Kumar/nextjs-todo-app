"use client";

import { useState, useEffect } from "react";
import TaskTile from "@/components/TaskTile";
import { useSession } from "next-auth/react";
import type React from "react"; // Added import for React

interface Task {
  _id: string;
  name: string;
  description: string;
  status: boolean;
}

interface TaskListProps {
  filter: string;
  searchQuery: string;
}

const TaskList: React.FC<TaskListProps> = ({ filter, searchQuery }) => {
  const { data: session }: any = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Local state for current page
  const [pageSize] = useState(10); // Local state for page size (can be adjusted if needed)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user?.token) return;

      setIsLoading(true);

      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/getAll?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      let filteredTasks = data;

      // Custom client-side filter
      if (filter === "Active") {
        filteredTasks = filteredTasks.filter(
          (task: { status: boolean }) => !task.status
        );
      } else if (filter === "Completed") {
        filteredTasks = filteredTasks.filter(
          (task: { status: boolean }) => task.status
        );
      }

      setTasks(filteredTasks);
      setIsLoading(false);
    };

    fetchTasks();
  }, [session, filter, searchQuery, currentPage, pageSize]);

  const handleToggleStatus = async (taskId: string) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todo/update?id=${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({ ...taskToUpdate, status: !taskToUpdate.status }),
      }
    );

    if (res.ok) {
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: !task.status } : task
        )
      );
    }
  };

  // Check if there are more tasks for the next page by comparing the number of tasks returned
  const hasMoreTasks = tasks.length === pageSize;

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {tasks?.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks?.map((task) => (
              <TaskTile
                key={task._id}
                task={task}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mr-2 rounded ${
            currentPage === 1
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <button
          onClick={() => hasMoreTasks && setCurrentPage(currentPage + 1)}
          disabled={!hasMoreTasks}
          className={`px-4 py-2 rounded ${
            !hasMoreTasks
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
