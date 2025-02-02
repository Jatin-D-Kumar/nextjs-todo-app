"use client"; // Ensure this component is rendered on the client

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Set initial theme based on localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      setDarkMode(savedTheme === "dark");
    } else {
      document.documentElement.classList.add("light");
      setDarkMode(false);
    }
  }, []);

  // Toggle theme and save in localStorage
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  // Handle sign-out
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirect to home after sign out
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <h1>My Task Manager</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none flex items-center justify-center bg-gray-200 dark:bg-gray-600"
        >
          <span
            className={`w-6 h-6 rounded-full bg-gray-800 dark:bg-yellow-500 transition-all duration-300 ${
              darkMode ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        {/* Sign-out button */}
        {session ? (
          <button
            onClick={handleSignOut}
            className="p-2 px-4 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
          >
            Sign Out
          </button>
        ) : (
          <div className="flex space-x-4">
            <Link
              href="/login"
              className={`${
                pathname === "/login"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300"
              } p-2 px-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`${
                pathname === "/signup"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 dark:text-gray-300"
              } p-2 px-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
