// 'use client';
// import { useProfiles } from '@/queries/profiles';
// import { Button } from '@/components/ui/button';
// import { logout } from '../auth/login/actions';
// import { useRouter } from 'next/navigation';
// import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
// import { useProfilesRealtime } from '@/queries/useProfilesRealtime';

// export default function ProfilesPage() {
//   const { data: profiles = [], isLoading, error } = useProfiles();
//   useProfilesRealtime() 
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-[#fff6fa]">
//       <div className="flex flex-col items-center py-4 w-full">
//         <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Profiles Directory</h1>
//           <div className="w-full flex flex-col items-center mb-8">
//             <div className="w-full flex justify-center gap-4">
//               <input
//                 type="text"
//                 placeholder="Search profiles..."
//                 className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white shadow"
//               />
//               <Button
//                 className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
//                 onClick={async () => {
//                   await logout();
//                   window.location.href = '/auth/login';
//                 }}
//               >
//                 Logout
//               </Button>
//               <Button
//                 className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700"
//                 // onClick={() => router.push('/profiles/add')}
//                  onClick={() => setTimeout(() => {
//   router.push("/profiles/add");
// }, 100)}
//               >
//                 Add Profile
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="w-full max-w-3xl mx-auto">
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : error ? (
//             <div className="text-red-500">Error loading profiles</div>
//           ) : (
//             <ProfilesTable profiles={profiles} onRowClick={(id) => router.push(`/profiles/${id}`)} />
            
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState } from 'react';
// import { useProfiles } from '@/queries/profiles';
// import { Button } from '@/components/ui/button';
// import { logout } from '../auth/login/actions';
// import { useRouter } from 'next/navigation';
// import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
// import { useProfilesRealtime } from '@/queries/useProfilesRealtime';

// const PAGE_SIZE = 10;

// export default function ProfilesPage() {
//   const [page, setPage] = useState(1);
//   const { data, isLoading, error } = useProfiles(page, PAGE_SIZE); // Pass page and PAGE_SIZE
//   useProfilesRealtime();
//   const router = useRouter();

//   const profiles = data?.data || [];
//   const totalCount = data?.count || 0;
//   const totalPages = Math.ceil(totalCount / PAGE_SIZE);

//   return (
//     <div className="min-h-screen bg-[#fff6fa]">
//       <div className="flex flex-col items-center py-4 w-full">
//         <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Profiles Directory</h1>
//           <div className="w-full flex flex-col items-center mb-8">
//             <div className="w-full flex justify-center gap-4">
//               <input
//                 type="text"
//                 placeholder="Search profiles..."
//                 className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white shadow"
//               />
//               <Button
//                 className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
//                 onClick={async () => {
//                   await logout();
//                   window.location.href = '/auth/login';
//                 }}
//               >
//                 Logout
//               </Button>
//               <Button
//                 className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700"
//                 onClick={() => setTimeout(() => {
//                   router.push("/profiles/add");
//                 }, 100)}
//               >
//                 Add Profile
//               </Button>
//             </div>
//           </div>
//         </div>
//         <div className="w-full max-w-3xl mx-auto">
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : error ? (
//             <div className="text-red-500">Error loading profiles</div>
//           ) : (
//             <>
//               <ProfilesTable profiles={profiles} onRowClick={(id) => router.push(`/profiles/${id}`)} />
//               {/* Pagination Controls */}
//               <div className="flex gap-2 items-center justify-center mt-4">
//                 <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
//                 <span>Page {page} of {totalPages}</span>
//                 <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</Button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { useProfiles } from '@/queries/profiles';
import { Button } from '@/components/ui/button';
import { logout } from '../auth/login/actions';
import { useRouter } from 'next/navigation';
import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
import { useProfilesRealtime } from '@/queries/useProfilesRealtime';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

export default function ProfilesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useProfiles(page, pageSize); // Pass page and pageSize
  useProfilesRealtime();
  const router = useRouter();

  const profiles = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

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
            <>
              <ProfilesTable profiles={profiles} onRowClick={(id) => router.push(`/profiles/${id}`)} />
              {/* Pagination Controls */}
              <div className="flex gap-2 items-center justify-center mt-4">
                <span>Rows per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={value => {
                    setPageSize(Number(value));
                    setPage(1); // Reset page when page size changes
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span>Page {page} of {totalPages}</span>
                <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
