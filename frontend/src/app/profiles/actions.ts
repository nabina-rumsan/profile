import { supabase } from '@/lib/supabaseClient'
import { CreateProfileRequest, UpdateProfileRequest } from '@/types/profile';

export async function fetchProfiles(page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('profiles')
    .select('id,full_name,email,status,username,bio,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function fetchProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,email,status,username,bio,created_at')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addProfile(profileData: CreateProfileRequest) {
  const { username, email, full_name, bio } = profileData;

  if (!username || !email || !full_name) {
    throw new Error('Username, email, and full name are required');
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');
  const { data, error } = await supabase.from('profiles').insert({
    user_id: user.id,
    username,
    email,
    full_name,
    bio,
    status: status || 'active',
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(profileData: UpdateProfileRequest) {
    const { id, ...updates } = profileData;

  const { data,error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
     .select()
    .single(); 
  if (error) throw error;
  return data
}

export async function deleteProfile(id: string) {
  const { data,error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
 
  if (error) throw error;
  return data
}
