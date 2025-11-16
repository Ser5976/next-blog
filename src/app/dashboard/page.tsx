import { TimeRageType } from '@/entities/time-range';
import { DashboardOverview } from '@/widgets/dashboard-overview';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ timeRange?: TimeRageType }>;
}) {
  const { timeRange } = await searchParams;

  return <DashboardOverview timeRange={timeRange ?? 'month'} />;
}
