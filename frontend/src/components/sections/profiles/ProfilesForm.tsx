"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddProfile } from '@/queries/profiles';
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { CreateProfileRequest } from "@/types/profile";

export default function ProfilesForm() {
  const addProfileMutation = useAddProfile();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  const form = e.currentTarget;
  if (!form) return;

 const formData = new FormData(form);
const profileData: CreateProfileRequest = Object.fromEntries(formData.entries()) as CreateProfileRequest;

  const result = await addProfileMutation.mutateAsync(profileData); 
  form.reset();
    if (result && result.id) {
      router.push(`/profiles/${result.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-6 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Profile Information</h2>
      <div className="flex flex-col gap-4">
        <div>
          <Label className="block font-semibold text-gray-700 mb-1" htmlFor="full_name">Full Name</Label>
          <Input name="full_name" id="full_name" placeholder="Enter your full_name" required className="bg-[#edf0f6]" />
        </div>
        <div>
          <Label className="block font-semibold text-gray-700 mb-1" htmlFor="username">Username</Label>
          <Input name="username" id="username" placeholder="Enter your username" required className="bg-[#edf0f6]" />
        </div>
        <div>
          <Label className="block font-semibold text-gray-700 mb-1" htmlFor="email">Email</Label>
          <Input name="email" id="email" placeholder="Enter your email address" type="email" required className="bg-[#edf0f6]" />
        </div>
        <div>
          <Label className="block font-semibold text-gray-700 mb-1" htmlFor="bio">Bio</Label>
          <Input name="bio" id="bio" placeholder="Tell us about yourself..." className="bg-[#edf0f6]" />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <Button type="submit" className="bg-[#c80032] text-white w-1/2">Create Profile</Button>
        <Button type="button" variant="outline" className="w-1/2" onClick={e => (e.currentTarget.form?.reset())}>Cancel</Button>
      </div>
    </form>
  );
}

