// app/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      router.push("/tasks"); // Redirect to tasks if already logged in
    }
  }, [session, router]);

  return (
    <div>
      {/* Home Page Content (or Loading Spinner while checking session) */}
    </div>
  );
};

export default HomePage;
