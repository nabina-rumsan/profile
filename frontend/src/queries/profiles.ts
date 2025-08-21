// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchProfiles, addProfile, updateProfile, deleteProfile } from '@/app/profiles/actions';

// export function useProfiles() {
//   return useQuery({
//     queryKey: ['profiles'],
//     queryFn: fetchProfiles,
//   });
// }

// export function useAddProfile() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (formData: FormData) => {
//       await addProfile(formData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profiles'] });
//     },
//   });
// }

// export function useUpdateProfile() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateProfile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profiles'] });
//     },
//   });
// }
// export function useUpdateId() {
//   const queryClient = useQueryClient();
//   // Get editingId from query cache
//   const { data: editingId } = useQuery({
//     queryKey: ['profiles', 'editingId'],
//     queryFn: () => queryClient.getQueryData(['profiles', 'editingId']) ?? null,
//   });

//   // Function to set editingId in query cache
//   const setEditingId = (id: string | null) => {
//     queryClient.setQueryData(['profiles', 'editingId'], id);
//   };

//   return { editingId, setEditingId };
// }

// export function useDeleteProfile() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (formData: FormData) => {
//       await deleteProfile(formData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profiles'] });
//     },
//   });
// }

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfiles, addProfile, updateProfile, deleteProfile } from '@/app/profiles/actions';

/* Fetch profiles */
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
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
    mutationFn: (formData: FormData) => deleteProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

