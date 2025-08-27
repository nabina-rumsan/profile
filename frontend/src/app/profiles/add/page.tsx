"use client";

import ProfilesForm from "@/sections/profiles/ProfilesForm";

export default function AddProfilePage() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Add New Profile</h1>
      <ProfilesForm />
    </div>
  );
}