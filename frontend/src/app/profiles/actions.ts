import { supabase } from '@/lib/supabaseClient'

export async function fetchProfiles() {
  const { data } = await supabase.from('profiles').select('id,username,email')
  return data || []
}

export async function addProfile({ username, email, userId }: { username: string; email: string; userId: string }) {
  const { error } = await supabase.from('profiles').insert({ username, email, user_id: userId })
  console.log('Adding profile:', { username, email, userId })
  return error
}

export async function updateProfile({ user_id:userId, username, email }: { user_id: string; username: string; email: string }) {
  const { error } = await supabase.from('profiles').update({ username, email }).eq('id', userId)
  console.log('Updating profile:', { userId, username, email })
  return error
}

export async function deleteProfile(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  return error
}
