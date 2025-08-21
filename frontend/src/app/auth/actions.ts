import { supabase } from '@/lib/supabaseClient'

export async function signInWithOtp(formData: FormData) {
  const email = formData.get('email') as string;
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  // Optionally: redirect('/auth/otp') or revalidatePath('/auth')
  // Do not return anything
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

export async function logout() {
  await supabase.auth.signOut();
}
