"use client";

import ProfilePosts from "@/sections/posts/ProfilePosts";
import ProfileDetail from "@/sections/profiles/ProfileDetail";
import { useParams } from "next/navigation";

export default function ProfileDetailPage() {
   const params = useParams();
  const id = params.id as string;

  return (
    <>
      <ProfileDetail />
      <ProfilePosts profileId={id} />
    </>
  );
}
