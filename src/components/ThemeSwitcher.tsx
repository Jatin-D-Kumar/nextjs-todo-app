// app/components/ThemeToggle.tsx

"use client";  // Ensure this component is rendered on the client

import { useEffect } from "react";

const ThemeToggle = () => {
  useEffect(() => {
    // Set initial theme based on localStorage when component mounts
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to light theme if no saved theme
      document.documentElement.classList.add("light");
    }
  }, []);

  // Toggle theme and save in localStorage
  const toggleTheme = () => {
    const newTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-10 p-2 rounded-full bg-gray-800 text-white"
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;
