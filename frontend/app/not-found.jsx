"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-stone-50">

      <h1 className="text-6xl font-bold text-orange-600 mb-4">
        404
      </h1>

      <h2 className="text-2xl font-semibold text-stone-900 mb-3">
        Page Not Found
      </h2>

      <p className="text-stone-600 max-w-md mb-6">
        The page you are looking for doesn’t exist or may have been moved.
      </p>

      <Button
        onClick={goHome}
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Go Back Home
      </Button>

    </div>
  );
}