"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddOrg, useUpdateOrg } from '@/queries/orgs';
import { useRouter } from 'next/navigation';
import useCurrentUserId from '@/components/hooks/useCurrentUserId';

export default function CreateOrgModal({ open, setOpen, onOrgCreated, org, mode = "create" }: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onOrgCreated?: () => void;
  org?: any;
  mode?: "create" | "edit";
}) {
  const addOrgMutation = useAddOrg();
  const updateOrgMutation = useUpdateOrg();
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      owner_id: org?.owner_id || currentUserId || '', // Use current user id if available
    };
    if (mode === "edit" && org) {
      await updateOrgMutation.mutateAsync({ id: org.id, updates: data });
    } else {
      await addOrgMutation.mutateAsync(data);
    }
    setOpen(false);
    onOrgCreated?.();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={() => setOpen(false)}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit Organization" : "Create Organization"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Name</label>
          <Input name="name" required defaultValue={org?.name || ''} />
          <label className="font-semibold text-gray-700">Description</label>
          <Input name="description" defaultValue={org?.description || ''} />
          <div className="flex gap-4 mt-4">
            <Button type="submit" className="bg-pink-600 text-white w-1/2">{mode === "edit" ? "Save" : "Create"}</Button>
            <Button type="button" variant="outline" className="w-1/2" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
