import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfiles, addProfile, updateProfile, deleteProfile, fetchProfileById } from '@/app/profiles/actions';


/* Fetch profiles */
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  });
}

/* Single profile */
export function useProfileId(id: string) {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: () => fetchProfileById(id),
    enabled: !!id, // avoid fetching with undefined
  });
}

/* Add profile */
export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => addProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}


/* Update profile */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'], refetchType: 'all'  });
    },
  });
}

/* Delete profile */
export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

