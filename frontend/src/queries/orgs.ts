import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchOrgs, fetchOrgById, addOrg, updateOrg, deleteOrg } from '@/app/orgs/actions';

export function useOrgs(options?: UseQueryOptions<any[]>) {
  return useQuery({
    queryKey: ['orgs'],
    queryFn: fetchOrgs,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useOrgId(id: number, options?: UseQueryOptions<any>) {
  return useQuery({
    queryKey: ['org', id],
    queryFn: () => fetchOrgById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAddOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
    },
  });
}

export function useUpdateOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { name?: string; description?: string } }) => updateOrg(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
    },
  });
}

export function useDeleteOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrg,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgs'] });
    },
  });
}