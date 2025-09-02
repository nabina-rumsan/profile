import { z } from "zod";

export const OrgSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Organization name is required").max(100),
  description: z.string().max(500).optional(),
  owner_id: z.number(),
  created_at: z.string().optional(), // ISO date string
});

export const CreateOrgSchema = OrgSchema.omit({ id: true, created_at: true });
export const UpdateOrgSchema = OrgSchema.partial().extend({
  id: z.number(),
});

export type Org = z.infer<typeof OrgSchema>;
export type CreateOrgRequest = z.infer<typeof CreateOrgSchema>;
export type UpdateOrgRequest = z.infer<typeof UpdateOrgSchema>;

export interface OrgsResponse {
  orgs: Org[];
  total: number;
  hasMore: boolean;
}