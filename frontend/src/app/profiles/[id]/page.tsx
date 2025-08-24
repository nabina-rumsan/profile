"use client";
import { useProfileId } from "@/queries/profiles";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const { data: profile, isLoading, error } = useProfileId(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error loading profile</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-3xl">Profile Detail</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 py-6">
        <div className="text-lg font-semibold text-gray-700">
          <span className="text-gray-500">Username:</span> {profile.username}
        </div>
        <div className="text-lg font-semibold text-gray-700">
          <span className="text-gray-500">Email:</span> {profile.email}
        </div>
        {/* Add more fields as needed */}
      </CardContent>
    </Card>
  );
}
