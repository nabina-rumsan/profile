import { supabase } from "@/lib/supabaseClient";

export async function getPostsByProfile(profileId: string) {
  const { data, error } = await supabase
    .from("posts")
      .select('*, profile:profiles(*)')
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  console.log("Fetched posts for profile:", profileId, data);
  return data;
}

export async function createPost(post: { profile_id: string; title: string; content: string }) {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updatePost(id: string, updates: { title?: string; content?: string }) {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}