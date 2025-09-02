"use client";
import { Button } from '@/components/ui/button';
import { useDeleteOrg } from '@/queries/orgs';
import { useState } from 'react';
import CreateOrgModal from './CreateOrgModal';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function OrgActions({ org, onOrgUpdated }: { org: any; onOrgUpdated?: () => void }) {
  const router = useRouter();
  const deleteOrgMutation = useDeleteOrg();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deleteOrgMutation.mutateAsync(org.id);
    setDeleteDialogOpen(false);
    onOrgUpdated?.();
     router.push("/orgs");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {editOpen && (
        <CreateOrgModal open={editOpen} setOpen={setEditOpen} org={org} mode="edit" onOrgCreated={onOrgUpdated} />
      )}
    </div>
  );
}

