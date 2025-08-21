import { supabase } from '@/lib/supabaseClient'

export async function fetchProfiles() {
  const { data } = await supabase.from('profiles').select('id,username,email')
  return data || []
}

export async function addProfile(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');
  await supabase.from('profiles').insert({
    user_id: user.id,
    username,
    email,
  });
  // Optionally: redirect('/profiles') or revalidatePath('/profiles')
  // Do not return anything
}

export async function updateProfile({ id, username, email }: { id: string; username: string; email: string }) {
  const { error } = await supabase.from('profiles').update({ username, email }).eq('id', id)
  console.log('Updating profile:', { id, username, email })
  return error
}

export async function deleteProfile(id: string) {
  await supabase.from('profiles').delete().eq('id', id);
  // Do not return anything
}
