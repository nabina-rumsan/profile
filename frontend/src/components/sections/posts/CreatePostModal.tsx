"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreatePost, useUpdatePost } from "@/queries/posts";
import { useRouter } from "next/navigation";

export default function PostModal({
  open,
  setOpen,
  profileId,
  post,
  mode = "create",
  onPostUpdated,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  profileId: string;
  post?: any;
  mode?: "create" | "edit";
  onPostUpdated?: () => void;
}) {
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (mode === "edit" && post) {
      const updates = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      };
      await updatePostMutation.mutateAsync({ id: post.id, updates });
      onPostUpdated?.();
    } else {
      const data = {
        profile_id: profileId,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      };
      await createPostMutation.mutateAsync(data);
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit Post" : "Create Post"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Title</label>
          <Input name="title" defaultValue={post?.title || ""} required />
          <label className="font-semibold text-gray-700">Content</label>
          <Input name="content" defaultValue={post?.content || ""} required />
          <div className="flex gap-4 mt-4">
            <Button type="submit" className="bg-pink-600 text-white w-1/2">
              {mode === "edit" ? "Save" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
