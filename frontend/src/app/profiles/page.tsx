'use client';
import { useProfiles } from '@/queries/profiles';
import { Button } from '@/components/ui/button';
import { logout } from '../auth/login/actions';
import { useRouter } from 'next/navigation';
import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
import { useProfilesRealtime } from '@/queries/useProfilesRealtime';

export default function ProfilesPage() {
  const { data: profiles = [], isLoading, error } = useProfiles();
  useProfilesRealtime() 
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fff6fa]">
      <div className="flex flex-col items-center py-4 w-full">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profiles Directory</h1>
          <div className="w-full flex flex-col items-center mb-8">
            <div className="w-full flex justify-center gap-4">
              <input
                type="text"
                placeholder="Search profiles..."
                className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white shadow"
              />
              <Button
                className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
                onClick={async () => {
                  await logout();
                  window.location.href = '/auth/login';
                }}
              >
                Logout
              </Button>
              <Button
                className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700"
                // onClick={() => router.push('/profiles/add')}
                 onClick={() => setTimeout(() => {
  router.push("/profiles/add");
}, 100)}
              >
                Add Profile
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error loading profiles</div>
          ) : (
            <ProfilesTable profiles={profiles} onRowClick={(id) => router.push(`/profiles/${id}`)} />
          )}
        </div>
      </div>
    </div>
  );
}
