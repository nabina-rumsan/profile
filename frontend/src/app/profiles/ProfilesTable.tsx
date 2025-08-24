'use client'


export default function ProfilesTable({ profiles, onRowClick }: { profiles: any[], onRowClick?: (id: string) => void }) {


  return (
    <div className="flex flex-col gap-6 p-8">
      {profiles?.map((profile) => {
        if (!profile?.id) return null;
        return (
          <div
            key={profile.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 hover:shadow-lg transition cursor-pointer"
            onClick={() => onRowClick && onRowClick(profile.id)}
          >
            <div className="flex items-center gap-4 mb-2">
              {/* Avatar image placeholder (circle with initial) */}
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {/* Replace with profile image if available */}
                <span className="text-lg font-bold text-gray-700">
                  {profile.full_name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-gray-900">{profile.full_name}</span>
                <span className="text-sm text-gray-500">@{profile.username}</span>
              </div>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${profile.status === "active" ? "bg-green-600 text-white" : "bg-pink-400 text-white"}`}>
                {profile.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-1">{profile.bio || "No bio provided."}</div>
            <div className="text-xs text-gray-400">{profile.email}</div>
          </div>
        );
      })}
    </div>
  );
}
