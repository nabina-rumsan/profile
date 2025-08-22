// "use client";
// import { useVerifyOtp } from '@/queries/auth';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { useEffect, useRef } from 'react';

// export default function OtpVerification() {
//   const otpRef = useRef<HTMLInputElement>(null);
//   const emailRef = useRef('');
//   const verifyOtpMutation = useVerifyOtp();

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       emailRef.current = localStorage.getItem('otp_email') || '';
//     }
//   }, []);

//   async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const otp = otpRef.current?.value || '';
//     const email = emailRef.current;
//     const { error } = await verifyOtpMutation.mutateAsync({ email, otp });
//     if (!error) {
//       window.location.href = '/profiles';
//     } else {
//       alert('Invalid OTP. Try again.');
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen px-4">
//       <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
//       <form onSubmit={handleOtpSubmit} className="w-full max-w-sm">
//         <Input
//           type="text"
//           name="otp"
//           placeholder="Enter OTP"
//           required
//           className="mb-4"
//           ref={otpRef}
//         />
//         <Button type="submit" className="w-full">Verify OTP</Button>
//       </form>
//     </div>
//   );
// }


"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "./actions";

export default function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    const { error } = await verifyOtp(email, otp);

    if (!error) {
      router.push("/profiles");
    } else {
      alert("Invalid OTP. Try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
      <form onSubmit={handleOtpSubmit} className="w-full max-w-sm">
        <Input type="hidden" name="email" value={email} />
        <Input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          required
          className="mb-4"
        />
        <Button type="submit" className="w-full">Verify OTP</Button>
      </form>
    </div>
  );
}
