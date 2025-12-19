import { PenTool, Shield, UserPlus, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface UserStatsProps {
  stats: {
    total: number;
    admins: number;
    authors: number;
    regular: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      description: 'Registered in system',
    },
    {
      title: 'Administrators',
      value: stats.admins,
      icon: Shield,
      description: 'System administrators',
      className: 'text-red-600',
    },
    {
      title: 'Authors',
      value: stats.authors,
      icon: PenTool,
      description: 'Content creators',
      className: 'text-blue-600',
    },
    {
      title: 'Regular Users',
      value: stats.regular,
      icon: UserPlus,
      description: 'Regular users',
      className: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon
              className={`h-4 w-4 ${item.className || 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
