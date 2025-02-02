"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  name: string;
  description: string;
  status: boolean;
}

const Statistics = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user?.token) return;

      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/getAll`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
      setIsLoading(false);
    };

    fetchTasks();
  }, [session]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-72px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status).length;
  const activeTasks = totalTasks - completedTasks;

  const completedPercentage = totalTasks
    ? (completedTasks / totalTasks) * 100
    : 0;
  const activePercentage = 100 - completedPercentage;

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto my-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              Task Statistics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overview of your tasks' progress
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Tasks
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {totalTasks}
                </dd>
              </div>

              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed Tasks
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {completedTasks} ({completedPercentage.toFixed(2)}%)
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Tasks
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {activeTasks} ({activePercentage.toFixed(2)}%)
                </dd>
              </div>

              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Visual Representation
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {/* Visual Representation */}
                  <div className="flex items-center">
                    <div
                      style={{
                        width: `${completedPercentage}%`,
                        height: "20px",
                        backgroundColor: "#4CAF50",
                      }}
                    ></div>
                    <div
                      style={{
                        width: `${activePercentage}%`,
                        height: "20px",
                        backgroundColor: "#FF9800",
                      }}
                    ></div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
          <button
            onClick={() => router.push("/tasks")}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back To Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
