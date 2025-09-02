"use client";
import { Button } from "@/components/ui/button";
import { useDeleteProfile } from "@/queries/profiles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import useCurrentUserId from "@/components/hooks/useCurrentUserId";

export default function ProfileActions({ id, profile, onProfileUpdated }: { id: string, profile: any, onProfileUpdated?: () => void }) {
  const deleteProfileMutation = useDeleteProfile();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const currentUserId = useCurrentUserId();
  const isOwner = profile?.user_id === currentUserId;

  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="outline"
        className="ml-2 text-blue-600 border-blue-600 font-semibold"
        onClick={() => setEditOpen(true)}
        disabled={!isOwner}
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
            disabled={!isOwner}
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteProfileMutation.mutateAsync(id);
                setDeleteDialogOpen(false);
                router.push("/profiles");
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {editOpen && (
        <EditProfileModal
          open={editOpen}
          setOpen={setEditOpen}
          id={id}
          profile={profile}
          onProfileUpdated={onProfileUpdated}
        />
      )}
    </div>
  );
}
