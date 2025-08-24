"use client";
import { useProfileId } from "@/queries/profiles";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const { data: profile, isLoading, error } = useProfileId(id);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading profile</div>;
  if (!profile) return <div className="text-center py-8">No profile found.</div>;

  return (
    <div className="min-h-screen bg-[#fff6fa]">
      <div className="max-w-2xl mx-auto py-10">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" className="text-pink-600 font-semibold px-0" onClick={() => window.history.back()}>
            &larr; Back to Profiles
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          Profile Details
        </h1>
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-start gap-4" style={{ minWidth: 600 }}>
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
              <span className={`mt-2 px-2 py-0.5 rounded text-xs font-semibold ${profile.status === "active" ? "bg-green-600 text-white" : "bg-pink-400 text-white"}`}>
                {profile.status}
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-start mt-2">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-16">Email</span>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-16">Bio</span>
              <span className="text-gray-600">{profile.bio || "No bio provided."}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-16">Joined</span>
              <span className="text-gray-600">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
