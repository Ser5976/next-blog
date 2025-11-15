import { DashboardOverview } from '@/widgets/dashboard-overview';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ timeRange?: 'week' | 'month' | 'year' }>;
}) {
  const { timeRange } = await searchParams;

  return <DashboardOverview timeRange={timeRange ?? 'month'} />;
}
