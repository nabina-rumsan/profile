'use client'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash ,Edit2Icon} from 'lucide-react'
import { useDeleteProfile, useUpdateProfile } from '@/queries/profiles'
import { useState } from 'react'

export default function ProfilesTable({ profiles }: { profiles: any[] }) {
  const deleteProfileMutation = useDeleteProfile();
  const updateProfileMutation = useUpdateProfile();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(profileId: string) {
    await deleteProfileMutation.mutateAsync(profileId);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfileMutation.mutateAsync({
      user_id: formData.get('id') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
    });
    setEditingId(null);
  }

  return (
    <Table className="min-w-full border border-gray-300 rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles?.map((profile) => {
          if (!profile?.id) return null;
          const isEditing = editingId === profile.id;

          return (
            <TableRow key={profile.id}>
              <TableCell>
                {isEditing ? (
                  <form onSubmit={handleEdit} className="flex gap-2">
                    <input type="hidden" name="id" value={profile.id} />
                    <input
                      name="username"
                      defaultValue={profile.username ?? ''}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      name="email"
                      defaultValue={profile.email ?? ''}
                      className="border rounded px-2 py-1"
                    />
                    <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}>Save</Button>
                  </form>
                ) : (
                  profile.username
                )}
              </TableCell>
              <TableCell>{!isEditing && profile.email}</TableCell>
              <TableCell className="flex gap-2">
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(profile.id)}
                    aria-label={`Edit ${profile.username}`}
                  >
                    <Edit2Icon size={16} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(profile.id)}
                  disabled={deleteProfileMutation.isPending}
                  aria-label={`Delete ${profile.username}`}
                >
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
