import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OrgActions from './OrgActions';

export default function Organization({ org, onOrgUpdated }: { org: any; onOrgUpdated?: () => void }) {
  return (
    <Card className="hover:shadow-lg transition cursor-pointer">
      <CardHeader className="flex items-center justify-between mb-2">
        <div>
          <CardTitle className="text-lg text-gray-900">{org.name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">{org.description}</CardDescription>
        </div>
        <OrgActions org={org} onOrgUpdated={onOrgUpdated} />
      </CardHeader>
      <div className="text-xs text-gray-400 px-6 pb-2">Owner: {org.owner_id}</div>
    </Card>
  );
}
