import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  profile_id: z.string(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(2000),
  created_at: z.string().optional(), // ISO date string
  updated_at: z.string().optional(), // ISO date string
  likes: z.number().optional(),
  comments: z.number().optional(),
  profile: z.any().optional(), // for joined profile data
});

export const CreatePostSchema = PostSchema.omit({ id: true, created_at: true, updated_at: true });

export const UpdatePostSchema = PostSchema.partial().extend({
  id: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePostRequest = z.infer<typeof CreatePostSchema>;
export type UpdatePostRequest = z.infer<typeof UpdatePostSchema>;

export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}
