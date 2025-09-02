import { usePostsByProfile } from "@/queries/posts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostActions from "./PostActions";
import CreatePostModal from "./CreatePostModal";
import { usePostsRealtime } from "@/realtime/usePostsRealtime";
import useCurrentUserId from "@/components/hooks/useCurrentUserId";

export default function ProfilePosts({ profileId, profile }: { profileId: string, profile: any }) {
  const { data: posts = [], isLoading, error } = usePostsByProfile(profileId);
  usePostsRealtime(profileId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const currentUserId = useCurrentUserId();
  const isOwner = profile?.user_id === currentUserId;

  const handleCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div className="text-red-500">Error loading posts</div>;

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      <div className="w-full max-w-2xl flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Posts ({posts.length})</h2>
        <Button className="bg-pink-600 text-white" onClick={handleCreate} disabled={!isOwner}>
          + Create Post
        </Button>
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts found.</div>
        ) : (
          posts.map((post: any) => (
            <Card key={post.id} className="bg-white rounded-xl shadow-md p-8 border flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xl text-gray-700 overflow-hidden">
                  {post.author_avatar ? (
                    <img src={post.profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    post.profile?.full_name.charAt(0).toUpperCase() 
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{post.profile?.full_name  || "Unknown"}</span>
                  <div className="flex items-center gap-2">
                    {post.profile?.username && (
                      <span className="text-gray-500">@{post.profile?.username}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {post.created_at ? `${Math.floor((Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago` : ""}
                    </span>
                  </div>
                </div>
              </div>
              {post.title && (
                <div className="text-lg font-bold text-gray-900 mb-1">{post.title}</div>
              )}
              <div className="text-base text-gray-800 mb-2">{post.content}</div>
              <div className="flex gap-6 items-center text-gray-500 text-sm mb-2">
                <span className="flex items-center gap-1"><span>❤️</span>{post.likes ?? 0}</span>
                <span className="flex items-center gap-1"><span>💬</span>{post.comments ?? 0}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <PostActions
                  id={post.id}
                  post={post}
                  onEdit={() => handleEdit(post)}
                  onPostUpdated={() => setModalOpen(false)}
                />
              </div>
            </Card>
          ))
        )}
      </div>
      {modalOpen && (
        <CreatePostModal
          open={modalOpen}
          setOpen={setModalOpen}
          profileId={profileId}
          post={editingPost}
          mode={editingPost ? "edit" : "create"}
          onPostUpdated={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}