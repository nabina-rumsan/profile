"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCurrentUserId from "@/components/hooks/useCurrentUserId";
import Login from "@/components/sections/login/Login";

export default function Home() {
  const userId = useCurrentUserId();
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      router.push("/profiles");
    }
  }, [userId, router]);

  // Show login only if not authenticated
  return !userId ? <Login /> : null;
}
