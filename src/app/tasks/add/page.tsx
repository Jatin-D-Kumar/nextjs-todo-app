"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddTask = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!taskName || taskName.length > 50) {
      setError("Title must be between 1 and 50 characters.");
      return;
    }

    if (description.length > 120) {
      setError("Description cannot exceed 120 characters.");
      return;
    }

    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/create`,
        {
          method: "POST",
          body: JSON.stringify({
            name: taskName,
            description,
            status: false,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );

      if (res.ok) {
        router.push("/tasks");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create task");
      }
    } catch (err) {
      setError("An error occurred while creating the task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Create New Task
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below to create a new task.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Task Title */}
                  <div>
                    <label
                      htmlFor="taskName"
                      className="block text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Task Title
                    </label>
                    <input
                      id="taskName"
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter task title"
                    />
                  </div>

                  {/* Task Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      Task Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter task description"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error: {error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isLoading ? "Creating..." : "Create Task"}
                    </button>
                    <Link
                      href={`/tasks`}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
