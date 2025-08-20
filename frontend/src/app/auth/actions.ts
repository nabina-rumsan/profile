import { supabase } from '@/lib/supabaseClient'

export async function signInWithOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
  return { data, error }
}

export async function verifyOtp(email: string, otp: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  })
  return { data, error }
}

export async function refreshSession(refresh_token: string) {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token })
  return { data, error }
}
