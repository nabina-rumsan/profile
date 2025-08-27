"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/queries/profiles";
import { useRouter } from "next/navigation";

export default function EditProfileModal({
  open,
  setOpen,
  id,
  profile,
  onProfileUpdated,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  id: string;
  profile: any;
  onProfileUpdated?: () => void;
}) {
  const updateProfileMutation = useUpdateProfile();
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      id,
      full_name: formData.get("full_name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      bio: formData.get("bio") as string,
    };

    console.log("Edit form submitted:", data);

    await updateProfileMutation.mutateAsync(data);
    setOpen(false);
    onProfileUpdated?.();
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
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold text-gray-700">Full Name</label>
          <Input name="full_name" defaultValue={profile?.full_name || ""} required />

          <label className="font-semibold text-gray-700">Username</label>
          <Input name="username" defaultValue={profile?.username || ""} required />

          <label className="font-semibold text-gray-700">Email</label>
          <Input
            name="email"
            type="email"
            defaultValue={profile?.email || ""}
            required
          />

          <label className="font-semibold text-gray-700">Bio</label>
          <Input name="bio" defaultValue={profile?.bio || ""} />

          <div className="flex gap-4 mt-4">
            <Button type="submit" className="bg-pink-600 text-white w-1/2">
              Save
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

