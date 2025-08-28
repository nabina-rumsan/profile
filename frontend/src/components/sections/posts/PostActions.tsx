"use client";
import { Button } from "@/components/ui/button";
import { useDeletePost } from "@/queries/posts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function PostActions({ id, post, onEdit, onPostUpdated }: { id: string, post: any, onEdit?: () => void, onPostUpdated?: () => void }) {
  const deletePostMutation = useDeletePost();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="outline"
        className="ml-2 text-blue-600 border-blue-600 font-semibold"
        onClick={onEdit}
      >
        Edit
      </Button>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="ml-2 font-semibold"
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deletePostMutation.mutateAsync(id);
                setDeleteDialogOpen(false);
               
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
