'use client';
import { useProfiles } from '@/queries/profiles';
import ProfilesTable from './ProfilesTable';
import ProfilesForm from './ProfilesForm';
import { Button } from '@/components/ui/button';
import { logout } from '../auth/actions';

export default function ProfilesPage() {
  const { data: profiles = [], isLoading, error } = useProfiles();

  return (
    <div className="p-8">
     
      <div className="flex justify-end mb-4">
  <Button
    onClick={async () => {
      await logout();
      window.location.href = '/auth';
    }}
  >
    Logout
  </Button>
</div>
       <h1 className="text-2xl font-bold mb-4">Profiles</h1>
      <ProfilesForm />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading profiles</div>
      ) : (
        <ProfilesTable profiles={profiles} />
      )}
    </div>
  );
}
