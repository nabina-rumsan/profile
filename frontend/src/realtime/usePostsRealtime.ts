'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types/post';
import { POST_KEYS } from '@/queries/posts';
import { QUERY_KEYS } from '@/queries/profiles';

export function usePostsRealtime(profileId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {

          const newPost = payload.new as Post;
          const oldPost = payload.old as Post;


          queryClient.setQueryData<Post[]>(POST_KEYS.posts(profileId), (old = []) => {
            // if (
            //   payload.eventType === 'INSERT' &&
            //   newPost.profile_id?.toString() === profileId.toString()
            // )
            //   // return [...old, newPost];
            //     return [...old.filter((p) => p.id !== newPost.id), newPost];
            if (
  payload.eventType === 'INSERT' &&
  newPost.profile_id?.toString() === profileId.toString()
) {
  // Try to get profile from cache
  const profile = queryClient.getQueryData(QUERY_KEYS.profile(newPost.profile_id));
console.log("Realtime post insert:", { newPost, profile, oldCache: old });
  const hydratedPost = {
    ...newPost,
    profile: profile ?? { id: newPost.profile_id, full_name: 'Unknown', username: 'unknown' },
  };
  console.log("Hydrated post:", hydratedPost);

  return [...old.filter((p) => p.id !== newPost.id), hydratedPost];
}

            // if (
            //   payload.eventType === 'UPDATE' &&
            //   newPost.profile_id?.toString() === profileId.toString()
            // )
              // return old.map((p) => (p.id === newPost.id ? newPost : p));
              if (
  payload.eventType === 'UPDATE' &&
  newPost.profile_id?.toString() === profileId.toString()
) {
    console.log("Realtime post update testing:", { newPost, oldCache: old });

  return old.map((p) =>
    p.id === newPost.id
      ? { ...p, ...newPost, profile: p.profile } // keep profile intact
      : p
  );
}

            if (
              payload.eventType === 'DELETE'
            ) {
              if (oldPost && oldPost.id) {
                return old.filter((p) => p.id !== oldPost.id);
              }
              return old;
            }
            return old;
          });

          if (
            payload.eventType === 'UPDATE' &&
            newPost.profile_id?.toString() === profileId.toString()
          )
            queryClient.setQueryData(POST_KEYS.post(newPost.id), newPost);
          if (
            payload.eventType === 'DELETE' &&
            oldPost &&
            oldPost.id
          )
            queryClient.removeQueries({ queryKey: POST_KEYS.post(oldPost.id) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, profileId]);
}