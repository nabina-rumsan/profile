import { supabase } from '@/lib/supabaseClient'

export async function fetchProfiles() {
  const { data } = await supabase.from('profiles').select('id,full_name,email,status,username,bio')
  return data || []
}

// Fetch single profile by ID
export async function fetchProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*') // or list the fields you need
    .eq('id', id)
    .single();   // ensures only one row is returned

  if (error) throw error;
  return data;
}



export async function addProfile(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const fullname = formData.get('fullname') as string;
  const bio = formData.get('bio') as string;

  if (!username || !email || !fullname) {
    throw new Error('Username, email, and full name are required');
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');
  const { data, error } = await supabase.from('profiles').insert({
    user_id: user.id,
    username,
    email,
    full_name: fullname,
    bio,
    status: 'active', // set default status
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile({ id, full_name,username, email, bio }: { id: string; full_name:string;username: string; email: string; bio:string }) {
  const { error } = await supabase.from('profiles').update({ full_name,username, email , bio}).eq('id', id)
  console.log('Updating profile:', { id, full_name,username, email,bio })
  return error
}

export async function deleteProfile(id: string) {
  await supabase.from('profiles').delete().eq('id', id);
  // Do not return anything
}
