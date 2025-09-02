// import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
// import { fetchOrgs, fetchOrgById, addOrg, updateOrg, deleteOrg, fetchProfilesByOrgId } from '@/app/orgs/actions';
// import { Profile } from '@/types/profile';

// export function useOrgs(options?: UseQueryOptions<any[]>) {
//   return useQuery({
//     queryKey: ['orgs'],
//     queryFn: fetchOrgs,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// }

// export function useOrgId(id: number, options?: UseQueryOptions<any>) {
//   return useQuery({
//     queryKey: ['org', id],
//     queryFn: () => fetchOrgById(id),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// }

// export function useAddOrg() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: addOrg,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['orgs'] });
//     },
//   });
// }

// export function useUpdateOrg() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, updates }: { id: number; updates: { name?: string; description?: string } }) => updateOrg(id, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['orgs'] });
//     },
//   });
// }

// export function useDeleteOrg() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteOrg,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['orgs'] });
//     },
//   });
// }

// export function useProfilesByOrgId(orgId: number, options?: UseQueryOptions<Profile[]>) {
//   return useQuery({
//     queryKey: ['profiles', 'org', orgId],
//     queryFn: () => fetchProfilesByOrgId(orgId),
//     enabled: !!orgId,
//     staleTime: 5 * 60 * 1000,
//     ...options,
//   });
// }

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchOrgs, fetchOrgById, addOrg, updateOrg, deleteOrg, fetchProfilesByOrgId } from '@/app/orgs/actions';
import { toast } from 'react-hot-toast';
import { Org, CreateOrgRequest, UpdateOrgRequest } from '@/types/org';
import { Profile } from '@/types/profile';

/* -------------------- Query Keys -------------------- */
export const ORG_KEYS = {
  orgs: ['orgs'] as const,
  org: (id: number) => ['org', String(id)] as const,
  profilesByOrg: (orgId: number) => ['profiles', 'org', String(orgId)] as const,
} as const;

/* -------------------- Fetch all orgs -------------------- */
export function useOrgs(options?: UseQueryOptions<Org[]>) {
  return useQuery({
    queryKey: ORG_KEYS.orgs,
    queryFn: fetchOrgs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/* -------------------- Fetch single org -------------------- */
export function useOrgId(id: number, options?: UseQueryOptions<Org>) {
  return useQuery({
    queryKey: ORG_KEYS.org(id),
    queryFn: () => fetchOrgById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/* -------------------- Add org -------------------- */
export function useAddOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgData: CreateOrgRequest) => addOrg({ ...orgData, owner_id: String(orgData.owner_id) }),
    onMutate: async (newOrg: CreateOrgRequest) => {
      await queryClient.cancelQueries({ queryKey: ORG_KEYS.orgs });
      const previousOrgs = queryClient.getQueryData<Org[]>(ORG_KEYS.orgs);

      // Optimistic update
      const optimisticOrg: Org = { id: Date.now(), ...newOrg } as Org;
      queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) => [optimisticOrg, ...old]);

      return { previousOrgs, optimisticOrg };
    },
    onSuccess: (data, _, context) => {
      queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
        old.map(org => (org.id === context?.optimisticOrg.id ? data : org))
      );
      toast.success('Organization created successfully!');
    },
    onError: (_, __, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(ORG_KEYS.orgs, context.previousOrgs);
      }
      toast.error('Failed to create organization');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.orgs });
    },
  });
}

/* -------------------- Update org -------------------- */
export function useUpdateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgData: UpdateOrgRequest) => updateOrg(orgData),
    onMutate: async (updatedOrg: UpdateOrgRequest) => {
      await queryClient.cancelQueries({ queryKey: ORG_KEYS.orgs });
      await queryClient.cancelQueries({ queryKey: ORG_KEYS.org(updatedOrg.id) });

      const previousOrgs = queryClient.getQueryData<Org[]>(ORG_KEYS.orgs);
      const previousOrg = queryClient.getQueryData<Org>(ORG_KEYS.org(updatedOrg.id));

      // Optimistic update
      queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
        old.map(org => (org.id === updatedOrg.id ? { ...org, ...updatedOrg } : org))
      );
      if (previousOrg) {
        queryClient.setQueryData(ORG_KEYS.org(updatedOrg.id), {
          ...previousOrg,
          ...updatedOrg,
        });
      }

      return { previousOrgs, previousOrg };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
        old.map(org => (org.id === data.id ? data : org))
      );
      queryClient.setQueryData(ORG_KEYS.org(data.id), data);
      toast.success('Organization updated successfully!');
    },
    onError: (_, updatedOrg, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(ORG_KEYS.orgs, context.previousOrgs);
      }
      if (context?.previousOrg) {
        queryClient.setQueryData(ORG_KEYS.org(updatedOrg.id), context.previousOrg);
      }
      toast.error('Failed to update organization');
    },
    onSettled: (_, __, updatedOrg) => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.orgs });
      if (updatedOrg?.id) {
        queryClient.invalidateQueries({ queryKey: ORG_KEYS.org(updatedOrg.id) });
      }
    },
  });
}

/* -------------------- Delete org -------------------- */
export function useDeleteOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOrg(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ORG_KEYS.orgs });
      const previousOrgs = queryClient.getQueryData<Org[]>(ORG_KEYS.orgs);

      queryClient.setQueryData<Org[]>(ORG_KEYS.orgs, (old = []) =>
        old.filter(org => org.id !== deletedId)
      );

      return { previousOrgs, deletedId };
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ORG_KEYS.org(deletedId) });
      toast.success('Organization deleted successfully!');
    },
    onError: (_, __, context) => {
      if (context?.previousOrgs) {
        queryClient.setQueryData(ORG_KEYS.orgs, context.previousOrgs);
      }
      toast.error('Failed to delete organization');
    },
    onSettled: (_, __, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.orgs });
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.org(deletedId) });
    },
  });
}

/* -------------------- Fetch profiles by org -------------------- */
export function useProfilesByOrgId(orgId: number, options?: UseQueryOptions<Profile[]>) {
  return useQuery({
    queryKey: ORG_KEYS.profilesByOrg(orgId),
    queryFn: () => fetchProfilesByOrgId(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
