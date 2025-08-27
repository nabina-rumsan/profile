"use client";
import { useProfileId } from "@/queries/profiles";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileActions from "@/components/sections/profiles/ProfileActions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function ProfileDetail() {
  const params = useParams();
const id = params.id as string;

  const { data: profile, isLoading, error } = useProfileId(id);
  const router = useRouter();

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading profile</div>;
  if (!profile) return <div className="text-center py-8">No profile found.</div>;

  return (
    <div className=" bg-[#fff6fa]">
      <div className="max-w-2xl mx-auto py-10">
        <ProfileActions id={id} profile={profile} onProfileUpdated={() => router.refresh()} />
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          Profile Details
        </h1>
        <Card className="rounded-xl shadow-md p-8 flex flex-col items-start gap-4 min-w-[600px]">
          <div className="flex items-center gap-6 mb-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || profile.username} />
              <AvatarFallback className="bg-gray-200 text-gray-700 text-3xl font-bold flex items-center justify-center">
                {profile.full_name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl text-gray-900">{profile.full_name || profile.username}</span>
              <span className="text-base text-gray-500">@{profile.username}</span>
              <Badge variant={profile.status === "active" ? "default" : "destructive"} className="mt-2">
                {profile.status}
              </Badge>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-start mt-2">
            <div className="flex gap-2">
              <Label className="font-semibold text-gray-700 w-16">Email</Label>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex gap-2">
              <Label className="font-semibold text-gray-700 w-16">Bio</Label>
              <span className="text-gray-600">{profile.bio || "No bio provided."}</span>
            </div>
            <div className="flex gap-2">
              <Label className="font-semibold text-gray-700 w-16">Joined</Label>
              <span className="text-gray-600">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
