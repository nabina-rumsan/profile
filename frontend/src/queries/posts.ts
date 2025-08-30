import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { getPostsByProfile, createPost, updatePost, deletePost } from "@/app/profiles/[id]/actions";
import { toast } from "react-hot-toast";
import { Post, CreatePostRequest, UpdatePostRequest } from "@/types/post";
import { QUERY_KEYS } from "./profiles";

/* -------------------- Query Keys -------------------- */
export const POST_KEYS = {
  posts: (profileId: string) => ["posts", profileId] as const,
  post: (id: string) => ["post", id] as const,
} as const;

/* -------------------- Fetch posts by profile -------------------- */
export function usePostsByProfile(profileId: string, options?: UseQueryOptions<Post[]>) {
    const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["posts", profileId],
    queryFn: async () => {
      const posts = await getPostsByProfile(profileId);

      return posts.map(post => {
        const profile = queryClient.getQueryData(QUERY_KEYS.profile(post.profile_id));
          console.log("Attaching profile to post:", { postId: post.id, profile });

        return {
          ...post,
          profile: profile ?? post.profile, // fallback to whatever came from backend
        };
      });
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/* -------------------- Create post -------------------- */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => createPost(postData),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: POST_KEYS.posts(newPost.profile_id) });
      const previousPosts = queryClient.getQueryData<Post[]>(POST_KEYS.posts(newPost.profile_id));

      const optimisticPost: Post = { id: Date.now().toString(), likes: 0, comments: 0, ...newPost };
      queryClient.setQueryData<Post[]>(POST_KEYS.posts(newPost.profile_id), (old = []) => [optimisticPost, ...old]);

      return { previousPosts, optimisticPost };
    },
    onSuccess: (data, _, context) => {
      if (context?.optimisticPost) {
        queryClient.setQueryData<Post[]>(POST_KEYS.posts(data.profile_id), (old = []) =>
          old.map(post => (post.id === context.optimisticPost.id ? data : post))
        );
      }
      toast.success("Post created successfully!");
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POST_KEYS.posts(context.optimisticPost.profile_id), context.previousPosts);
      }
      toast.error("Failed to create post");
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.posts(variables.profile_id) });
    },
  });
}

/* -------------------- Update post -------------------- */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
mutationFn: ({ id, ...updates }: UpdatePostRequest) => updatePost(id, updates),
    onMutate: async (updateRequest: UpdatePostRequest) => {
      const { id, ...updates } = updateRequest;
      // Find the profileId from cached posts
      const allKeys = queryClient.getQueryCache().findAll({});
      let profileId: string | undefined;
      for (const key of allKeys) {
        if (key.queryKey[0] === "posts") {
          const posts = key.state.data as Post[];
          if (posts?.some(p => p.id === id)) {
            profileId = key.queryKey[1] as string;
            break;
          }
        }
      }

      if (!profileId) return {};

      await queryClient.cancelQueries({ queryKey: POST_KEYS.posts(profileId) });
      const previousPosts = queryClient.getQueryData<Post[]>(POST_KEYS.posts(profileId));

      // Optimistic update
      queryClient.setQueryData<Post[]>(POST_KEYS.posts(profileId), (old = []) =>
        old.map(post => (post.id === id ? { ...post, ...updates } : post))
      );

      return { previousPosts, profileId };
    },
    onSuccess: (data) => {
      toast.success("Post updated successfully!");
    },
    onError: (_, __, context) => {
      if (context?.previousPosts && context?.profileId) {
        queryClient.setQueryData<Post[]>(POST_KEYS.posts(context.profileId), context.previousPosts);
      }
      toast.error("Failed to update post");
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: POST_KEYS.posts(variables.id) });
    },
  });
}

/* -------------------- Delete post -------------------- */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onMutate: async (deletedId) => {
      const allKeys = queryClient.getQueryCache().findAll();
      let profileId: string | undefined;
      for (const key of allKeys) {
        if (key.queryKey[0] === "posts") {
          const posts = key.state.data as Post[];
          if (posts?.some(p => p.id === deletedId)) {
            profileId = key.queryKey[1] as string;
            break;
          }
        }
      }

      if (!profileId) return {};

      await queryClient.cancelQueries({ queryKey: POST_KEYS.posts(profileId) });
      const previousPosts = queryClient.getQueryData<Post[]>(POST_KEYS.posts(profileId));

      queryClient.setQueryData<Post[]>(POST_KEYS.posts(profileId), (old = []) =>
        old.filter(post => post.id !== deletedId)
      );

      return { previousPosts, profileId };
    },
    onSuccess: (_, __, context) => {
      toast.success("Post deleted successfully!");
      if (context?.profileId) {
        queryClient.invalidateQueries({ queryKey: POST_KEYS.posts(context.profileId) });
      }
    },
    onError: (_, __, context) => {
      if (context?.previousPosts && context?.profileId) {
        queryClient.setQueryData<Post[]>(POST_KEYS.posts(context.profileId), context.previousPosts);
      }
      toast.error("Failed to delete post");
    },
  });
}
