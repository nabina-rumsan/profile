'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { POST_KEYS } from './posts';
import { Post } from '@/types/post';

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
            if (
              payload.eventType === 'INSERT' &&
              newPost.profile_id?.toString() === profileId.toString()
            )
              return [...old, newPost];
            if (
              payload.eventType === 'UPDATE' &&
              newPost.profile_id?.toString() === profileId.toString()
            )
              return old.map((p) => (p.id === newPost.id ? newPost : p));
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
            payload.eventType === 'INSERT' &&
            newPost.profile_id?.toString() === profileId.toString()
          ) {
            queryClient.invalidateQueries({ queryKey: POST_KEYS.posts(profileId) });
          }

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