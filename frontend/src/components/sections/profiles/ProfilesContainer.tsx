'use client';
import { useProfiles } from '@/queries/profiles';
import { Button } from '@/components/ui/button';
import { logout } from '../../../app/auth/login/actions';
import { useRouter } from 'next/navigation';
import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
import ProfilesPagination from '@/components/common/ProfilesPagination';
import { useProfilesRealtime } from '@/realtime/useProfilesRealtime';
import { usePagination } from '@/components/common/UsePagination';



export default function ProfilesContainer() {

  const { page, pageSize, setPagination } = usePagination();

  const { data, isLoading, error } = useProfiles(page, pageSize);
  useProfilesRealtime();
  const router = useRouter();

  const profiles = data?.data || [];
  const totalCount = data?.count || 0;

  return (
    <div className="min-h-screen bg-[#fff6fa]">
      <div className="flex flex-col items-center py-4 w-full">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profiles Directory</h1>

          {/* Actions */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="w-full flex justify-center gap-4">
              <input
                type="text"
                onChange={e => e.target.value}
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
                onClick={() => router.push("/profiles/add")}
              >
                Add Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profiles Table + Pagination */}
        <div className="w-full max-w-3xl mx-auto">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error loading profiles</div>
          ) : (
            <>
              <ProfilesTable
                profiles={profiles}
                onRowClick={(id) => router.push(`/profiles/${id}`)}
              />

           <ProfilesPagination
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={(newPage) => setPagination(newPage, pageSize)}
      onPageSizeChange={(newSize) => setPagination(1, newSize)}
    />
            </>
          )}
        </div>
      </div>
    </div>
  );
}