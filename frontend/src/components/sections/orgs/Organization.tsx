import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Organization({
  org,
  onClick,
}: {
  org: any;
  onClick?: (id: string) => void;
}) {
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick?.(org.id)}
    >
      <CardHeader className="flex items-center justify-between mb-2">
        <div>
          <CardTitle className="text-lg text-gray-900">{org.name}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {org.description}
          </CardDescription>
        </div>
      </CardHeader>
      <div className="text-xs text-gray-400 px-6 pb-2">
        Owner: {org.owner_id}
      </div>
    </Card>
  );
}
