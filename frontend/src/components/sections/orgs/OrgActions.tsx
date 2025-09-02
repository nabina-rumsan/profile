"use client"
import { Button } from '@/components/ui/button';
import { useDeleteOrg } from '@/queries/orgs';
import { useState } from 'react';
import CreateOrgModal from './CreateOrgModal';

export default function OrgActions({ org, onOrgUpdated }: { org: any; onOrgUpdated?: () => void }) {
  const deleteOrgMutation = useDeleteOrg();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    await deleteOrgMutation.mutateAsync(org.id);
    onOrgUpdated?.();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        Delete
      </Button>
      {editOpen && (
        <CreateOrgModal open={editOpen} setOpen={setEditOpen} org={org} mode="edit" onOrgCreated={onOrgUpdated} />
      )}
    </div>
  );
}
