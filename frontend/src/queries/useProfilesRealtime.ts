'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './profiles';
import { Profile } from '@/types/profile';

export function useProfilesRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('profiles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime profile event:', payload.eventType, payload);
          console.log('Realtime change profile:', payload);
          if (payload.eventType === 'UPDATE') {
            console.log('UPDATE payload.new:profile', payload.new);
          }
          queryClient.setQueryData<Profile[]>(QUERY_KEYS.profiles, (old = []) => {
            if (payload.eventType === 'INSERT') return [...old, payload.new as Profile];
            if (payload.eventType === 'UPDATE')
              return old.map((p) => (p.id === (payload.new as Profile).id ? (payload.new as Profile) : p));
            if (payload.eventType === 'DELETE')
              return old.filter((p) => p.id !== (payload.old as Profile).id);
            return old;
          });

          if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(QUERY_KEYS.profile(payload.new.id), payload.new);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(payload.new.id) });
          }

  
          if (payload.eventType === 'DELETE') {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.profile(payload.old.id) });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(payload.old.id) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
