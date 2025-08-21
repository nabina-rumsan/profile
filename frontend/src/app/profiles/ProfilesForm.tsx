"use client";
import { addProfile } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddProfile } from '@/queries/profiles';

export default function ProfilesForm() {
  const addProfileMutation = useAddProfile();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement | null;
    const formData = new FormData(form ?? undefined);
    await addProfileMutation.mutateAsync(formData);
    if (form) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input name="username" placeholder="Enter username" required />
      <Input name="email" placeholder="Enter email" type="email" required />
      <Button type="submit">Add Profile</Button>
    </form>
  );
}
