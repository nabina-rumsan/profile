import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  full_name: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Invalid email"),
  status: z.enum(["active", "inactive"]).optional(),
  username: z.string().min(1, "Username is required").max(50),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  created_at: z.string().optional(), // ISO date string
});

export const CreateProfileSchema = ProfileSchema.omit({ id: true, created_at: true });

export const UpdateProfileSchema = ProfileSchema.partial().extend({
  id: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfileRequest = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;

export interface ProfilesResponse {
  profiles: Profile[];
  total: number;
  hasMore: boolean;
}

export type ProfileStatus = "active" | "inactive";
