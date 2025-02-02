// app/tasks/edit/[id]/page.tsx

"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditTask = ({ params }: { params: { id: string } }) => {
  const { data: session }: any = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchTaskDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/todo/getById?id=${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch task details");
        }

        const data = await res.json();
        setTask(data);
        setTitle(data.name);
        setDescription(data.description);
      } catch (err) {
        setError("An error occurred while fetching task details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [session, params.id]);

  const handleSave = async () => {
    if (!title || title.length > 50) {
      setError("Title must be between 1 and 50 characters.");
      return;
    }

    if (description.length > 120) {
      setError("Description cannot exceed 120 characters.");
      return;
    }

    setError(""); // Reset error

    try {
      const sanitizedTitle = title.trim();
      const sanitizedDescription = description.trim();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/update?id=${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({
            ...task,
            name: sanitizedTitle,
            description: sanitizedDescription,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      router.push(`/tasks/${params.id}`);
    } catch (err) {
      setError("An error occurred while updating the task.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Task not found</p>
          <p>The requested task could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto my-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Edit Task
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Edit your task details.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Task Title
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  className="text-black dark:text-white bg-gray-100 dark:bg-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </dd>
            </div>

            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={120}
                  rows={4}
                  className="text-black dark:text-white bg-gray-100 dark:bg-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </dd>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4">
              <p className="font-bold">Error: {error}</p>
            </div>
          )}

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
            <button
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <Link
              href={`/tasks/${params.id}`}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
