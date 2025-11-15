import { Dashboard } from '@/widgets/dashboard';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ timeRange?: 'week' | 'month' | 'year' }>;
}) {
  const { timeRange } = await searchParams;

  return <Dashboard timeRange={timeRange ?? 'month'} />;
}
