"use client";

import ProfilePosts from "@/components/sections/posts/ProfilePosts";
import ProfileDetail from "@/components/sections/profiles/ProfileDetail";
import { useProfileId } from "@/queries/profiles";
import { useParams } from "next/navigation";

export default function ProfileDetailPage() {
   const params = useParams();
  const id = params.id as string;

   const { data: profile } = useProfileId(id);
  return (
    <>
      <ProfileDetail />
      <ProfilePosts profileId={id} profile={profile} />
    </>
  );
}
