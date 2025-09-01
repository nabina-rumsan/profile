import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchProfiles, addProfile, updateProfile, deleteProfile, fetchProfileById } from '@/app/profiles/actions';
import { toast } from 'react-hot-toast';
import { CreateProfileRequest, Profile, UpdateProfileRequest } from '@/types/profile';

/* -------------------- Query Keys -------------------- */
export const QUERY_KEYS = {
  profiles: ['profiles'] as const,
 profile: (id: string | number) => ['profile', String(id)] as const,
} as const;

/* -------------------- Fetch all profiles -------------------- */
export function useProfiles(
  page = 1, 
  pageSize = 10,   
  search = "",
  options?: UseQueryOptions<{ data: Profile[], count: number }>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.profiles, page, pageSize,search],
    queryFn: () => fetchProfiles(page, pageSize,search),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/* -------------------- Fetch single profile -------------------- */
export function useProfileId(id: string, options?: UseQueryOptions<Profile>) {
  return useQuery({
    queryKey: QUERY_KEYS.profile(id),
    queryFn: () => fetchProfileById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/* -------------------- Add profile -------------------- */
export function useAddProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: CreateProfileRequest) => addProfile(profileData),
    onMutate: async (newProfile:CreateProfileRequest) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.profiles });
      const previousProfiles = queryClient.getQueryData<any[]>(QUERY_KEYS.profiles);

      // Optimistic update
      const optimisticProfile = { id: Date.now(), ...newProfile };
      queryClient.setQueryData<any[]>(QUERY_KEYS.profiles, (old = []) => [optimisticProfile, ...old]);

      return { previousProfiles, optimisticProfile };
    },
    onSuccess: (data, _, context) => {
      // Replace optimistic profile with server response
      queryClient.setQueryData<any[]>(QUERY_KEYS.profiles, (old = []) =>
        old.map(profile => (profile.id === context?.optimisticProfile.id ? data : profile))
      );
      toast.success('Profile added successfully!');
    },
    onError: (_, __, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(QUERY_KEYS.profiles, context.previousProfiles);
      }
      toast.error('Failed to add profile');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
}

/* -------------------- Update profile -------------------- */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => updateProfile(profileData),
    onMutate: async (updatedProfile: UpdateProfileRequest) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.profiles });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.profile(updatedProfile.id) });

      const previousProfiles = queryClient.getQueryData<any[]>(QUERY_KEYS.profiles);
      const previousProfile = queryClient.getQueryData<any>(QUERY_KEYS.profile(updatedProfile.id));

      // Optimistic update
      queryClient.setQueryData<any[]>(QUERY_KEYS.profiles, (old = []) =>
        old.map(profile => (profile.id === updatedProfile.id ? { ...profile, ...updatedProfile } : profile))
      );
      if (previousProfile) {
        queryClient.setQueryData(QUERY_KEYS.profile(updatedProfile.id), {
          ...previousProfile,
          ...updatedProfile,
        });
      }

      return { previousProfiles, previousProfile };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<any[]>(QUERY_KEYS.profiles, (old = []) =>
        old.map(profile => (profile.id === data.id ? data : profile))
      );
      queryClient.setQueryData(QUERY_KEYS.profile(data.id), data);
      toast.success('Profile updated successfully!');
    },
    onError: (_, updatedProfile, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(QUERY_KEYS.profiles, context.previousProfiles);
      }
      if (context?.previousProfile) {
        queryClient.setQueryData(QUERY_KEYS.profile(updatedProfile.id), context.previousProfile);
      }
      toast.error('Failed to update profile');
    },
    onSettled: (_, __, updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
      if (updatedProfile?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(updatedProfile.id) });
      }
    },
  });
}

/* -------------------- Delete profile -------------------- */
export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.profiles });
      const previousProfiles = queryClient.getQueryData<any[]>(QUERY_KEYS.profiles);

      queryClient.setQueryData<any[]>(QUERY_KEYS.profiles, (old = []) =>
        old.filter(profile => profile.id !== deletedId)
      );

      return { previousProfiles, deletedId };
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.profile(deletedId) });
      toast.success('Profile deleted successfully!');
    },
    onError: (_, __, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(QUERY_KEYS.profiles, context.previousProfiles);
      }
      toast.error('Failed to delete profile');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
}
