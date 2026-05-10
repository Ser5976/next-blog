import { TimeRageType } from '@/entities/time-range';
import { AuthorOverview } from '@/widgets/author-overview';

export default async function AuthorPage({
  searchParams,
}: {
  searchParams: Promise<{ timeRange?: TimeRageType }>;
}) {
  const { timeRange } = await searchParams;

  return <AuthorOverview timeRange={timeRange ?? 'month'} />;
}
