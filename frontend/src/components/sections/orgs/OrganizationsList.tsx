"use client";
import { useOrgs } from '@/queries/orgs';
import Organization from './Organization';
import { useState } from 'react';
import CreateOrgModal from './CreateOrgModal';
import { Button } from '@/components/ui/button';

export default function OrganizationsList() {
  const { data, isLoading, error } = useOrgs();
  const orgs = data || [];
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error loading organizations</div>;

  return (
    <div className="bg-[#fff0f6] min-h-screen py-8">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Organizations</h2>
          <Button
            className="bg-pink-600 text-white"
            onClick={() => setCreateOpen(true)}
          >
             Create Organization
          </Button>
        </div>
        {createOpen && (
          <CreateOrgModal open={createOpen} setOpen={setCreateOpen} onOrgCreated={() => {}} />
        )}
        {orgs.length === 0 ? (
          <div>No organizations found.</div>
        ) : (
          orgs.map((org: any) => (
            <Organization key={org.id} org={org} />
          ))
        )}
      </div>
    </div>
  );
}
