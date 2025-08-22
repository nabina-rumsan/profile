import { useMutation } from '@tanstack/react-query';
import { signInWithOtp } from '@/app/auth/login/actions';
import { verifyOtp } from '@/app/auth/otp-verification/actions';

export function useSendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const formData = new FormData();
      formData.append('email', email);
      await signInWithOtp(formData);
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      return await verifyOtp(email, otp);
    },
  });
}
