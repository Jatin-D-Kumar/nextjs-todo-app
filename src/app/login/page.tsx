"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/tasks"); // Redirect to tasks if logged in
    }
  }, [session, router]);

  // Validation
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 6 && /[a-z]/.test(password) && /[A-Z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   setError("Please enter a valid email.");
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   setError(
    //     "Password must be at least 6 characters long and contain both lowercase and uppercase letters."
    //   );
    //   return;
    // }

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/tasks");
    }
  };

  // Navigate to the signup page
  const handleSignUpRedirect = () => {
    router.push("/signup"); // This will push the user to the signup page
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-72px)] bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-black dark:text-white bg-gray-100 dark:bg-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black dark:text-white bg-gray-100 dark:bg-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-black dark:text-white">
          Don't have an account?{" "}
          <button
            onClick={handleSignUpRedirect}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
