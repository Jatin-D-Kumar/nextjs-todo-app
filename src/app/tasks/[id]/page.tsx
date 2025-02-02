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

const TaskDetails = ({ params }: { params: { id: string } }) => {
  const { data: session }: any = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deletionTimer, setDeletionTimer] = useState<NodeJS.Timeout | null>(
    null
  );
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
      } catch (err) {
        setError("An error occurred while fetching the task details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [session, params.id]);

  const handleDelete = () => {
    setIsDeleted(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/todo/delete?id=${params.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        router.push("/tasks");
      } catch (err) {
        setError("An error occurred while deleting the task.");
        setIsDeleted(false);
      }
    }, 5000);
    setDeletionTimer(timer);
  };

  const handleUndoDelete = () => {
    if (deletionTimer) {
      clearTimeout(deletionTimer);
      setDeletionTimer(null);
    }
    setIsDeleted(false);
  };

  const handleToggleStatus = async () => {
    if (!task) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/update?id=${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ ...task, status: !task.status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      setTask({ ...task, status: !task.status });
    } catch (err) {
      setError("An error occurred while updating the task status.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
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

  if (!task)
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

  if (isDeleted) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md w-full"
          role="alert"
        >
          <strong className="font-bold">Task deleted!</strong>
          <p className="block sm:inline">
            {" "}
            You will be redirected to the Tasks screen shortly.
          </p>
          <button
            onClick={handleUndoDelete}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Undo Delete
          </button>
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
              Task Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              View and manage your task
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Task name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {task.name}
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {task.description}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.status ? "Completed" : "Active"}
                  </span>
                  <button
                    onClick={handleToggleStatus}
                    className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Toggle Status
                  </button>
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created at
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {new Date(task.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {new Date(task.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
            <Link
              href={`/tasks/edit/${params.id}`}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Edit Task
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3"
            >
              Delete Task
            </button>
            <button
              onClick={() => router.push("/tasks")}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
