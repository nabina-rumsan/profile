"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithOtp } from "@/app/auth/login/actions";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Send OTP to email
    await signInWithOtp(new FormData(e.currentTarget));
    // Redirect to OTP verification, passing fullName as query param
    router.push(`/auth/otp-verification?email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="w-full max-w-sm">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          required
          className="mb-4"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <Button type="submit" className="w-full">Send OTP</Button>
      </form>
    </div>
  );
}
