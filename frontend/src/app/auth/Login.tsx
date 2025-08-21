"use client";
import { signInWithOtp } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSendOtp, useVerifyOtp } from '@/queries/auth';

export default function Login() {
  // Get query params for step and email
  let step = 'email';
  let email = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    step = params.get('step') || 'email';
    email = params.get('email') || '';
  }

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get('email') as string;
    await sendOtpMutation.mutateAsync(emailValue);
    window.location.href = `/auth?page=otp&step=otp&email=${encodeURIComponent(emailValue)}`;
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get('otp') as string;
    const emailValue = formData.get('email') as string || email;
    const { error } = await verifyOtpMutation.mutateAsync({ email: emailValue, otp });
    if (!error) {
      window.location.href = '/profiles';
    } else {
      alert('Invalid OTP. Try again.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Login with Email OTP</h2>
      {step === 'otp' ? (
        <form onSubmit={handleOtpSubmit} className="w-full max-w-sm">
          <input type="hidden" name="email" value={email} />
          <Input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            required
            className="mb-4"
          />
          <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
      ) : (
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
      )}
    </div>
  );
}
