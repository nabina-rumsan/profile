"use client";
import { useParams } from 'next/navigation';
import { useOrgId, useProfilesByOrgId } from '@/queries/orgs';
import ProfilesTable from '@/components/sections/profiles/ProfilesTable';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OrgActions from '@/components/sections/orgs/OrgActions';

export default function OrgDetail() {
  const params = useParams();
  const orgId = Number(params.id);
  const { data: org, isLoading: orgLoading, error: orgError } = useOrgId(orgId);
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfilesByOrgId(orgId);

  if (orgLoading || profilesLoading) return <div>Loading...</div>;
  if (orgError) return <div className="text-red-500">Error loading organization</div>;
  if (profilesError) return <div className="text-red-500">Error loading profiles</div>;
  if (!org) return <div>No organization found.</div>;

  return (
    <div className="min-h-screen bg-[#fff6fa] py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{org.name}</CardTitle>
                <CardDescription className="text-gray-600">{org.description}</CardDescription>
                <div className="text-xs text-gray-400 mt-2">Owner: {org.owner_id}</div>
              </div>
              <OrgActions org={org} onOrgUpdated={() => window.location.reload()} />
            </div>
          </CardHeader>
        </Card>
        <h2 className="text-xl font-bold mb-4">Profiles in this Organization</h2>
        <ProfilesTable profiles={profiles || []} />
      </div>
    </div>
  );
}
