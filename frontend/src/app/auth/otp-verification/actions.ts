import { supabase } from '@/lib/supabaseClient'


export async function verifyOtp(email: string, otp: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  })
  return { data, error }
}