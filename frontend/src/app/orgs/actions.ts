import { supabase } from '@/lib/supabaseClient';

export async function fetchOrgs() {
  const { data, error } = await supabase
    .from('orgs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchOrgById(id: number) {
  const { data, error } = await supabase
    .from('orgs')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function addOrg(orgData: { name: string; description?: string; owner_id: string }) {
  const { data, error } = await supabase
    .from('orgs')
    .insert([orgData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrg(id: number, updates: { name?: string; description?: string }) {
  const { data, error } = await supabase
    .from('orgs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOrg(id: number) {
  const { error } = await supabase
    .from('orgs')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function fetchProfilesByOrgId(orgId: number) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}