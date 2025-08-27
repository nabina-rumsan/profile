"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signInWithOtp } from "@/app/auth/login/actions";

export default function Login() {
  const router = useRouter();

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await signInWithOtp(formData);

    // redirect to OTP verification page
    const emailValue = formData.get("email") as string;
    router.push(`/auth/otp-verification?email=${encodeURIComponent(emailValue)}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Login with Email OTP</h2>
      <form onSubmit={handleEmailSubmit} className="w-full max-w-sm">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="mb-4"
        />
        <Button type="submit" className="w-full">Send OTP</Button>
      </form>
    </div>
  );
}
