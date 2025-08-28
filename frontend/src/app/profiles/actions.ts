import { supabase } from '@/lib/supabaseClient'
import { CreateProfileRequest, UpdateProfileRequest } from '@/types/profile';

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,email,status,username,bio,created_at');
  if (error) throw error;
  return data || [];
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
