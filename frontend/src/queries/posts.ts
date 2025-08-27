import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostsByProfile, createPost, updatePost, deletePost } from "@/app/profiles/[id]/actions";

export function usePostsByProfile(profileId: string) {
  return useQuery({
    queryKey: ["posts", profileId],
    queryFn: () => getPostsByProfile(profileId),
    enabled: !!profileId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.profile_id] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { title?: string; content?: string } }) => updatePost(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", variables.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
