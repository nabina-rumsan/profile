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
      id: formData.get('id') as string,
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
              {isEditing ? (
                <>
                  <TableCell>
                    <form id={`edit-username-form-${profile.id}`} onSubmit={handleEdit}>
                      <input type="hidden" name="id" value={profile.id} />
                      <input
                        name="username"
                        defaultValue={profile.username ?? ''}
                        className="border rounded px-2 py-1"
                      />
                    </form>
                  </TableCell>
                  <TableCell>
                    <form id={`edit-email-form-${profile.id}`} onSubmit={handleEdit}>
                      <input type="hidden" name="id" value={profile.id} />
                      <input
                        name="email"
                        defaultValue={profile.email ?? ''}
                        className="border rounded px-2 py-1"
                      />
                    </form>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const usernameForm = document.getElementById(`edit-username-form-${profile.id}`);
                        const emailForm = document.getElementById(`edit-email-form-${profile.id}`);
                        const usernameInput = usernameForm?.querySelector('input[name="username"]') as HTMLInputElement | null;
                        const emailInput = emailForm?.querySelector('input[name="email"]') as HTMLInputElement | null;
                        const username = usernameInput?.value ?? '';
                        const email = emailInput?.value ?? '';
                        updateProfileMutation.mutateAsync({
                          id: profile.id,
                          username,
                          email,
                        });
                        setEditingId(null);
                      }}
                      disabled={updateProfileMutation.isPending}
                    >
                      Save
                    </Button>
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
                </>
              ) : (
                <>
                  <TableCell>{profile.username}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(profile.id)}
                      aria-label={`Edit ${profile.username}`}
                    >
                      <Edit2Icon size={16} />
                    </Button>
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
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
