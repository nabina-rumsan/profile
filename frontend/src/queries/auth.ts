import { useMutation } from '@tanstack/react-query';
import { signInWithOtp, verifyOtp } from '@/app/auth/actions';

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
