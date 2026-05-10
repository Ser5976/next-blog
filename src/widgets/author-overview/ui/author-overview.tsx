'use client';

import { Eye, FileCheck2, FileText, MessageSquare } from 'lucide-react';

import { StatCard } from '@/entities/stat-card';
import { TimeFilter } from '@/entities/time-range';
import { ListSkeleton, Subtitle, Title, UniversalError } from '@/shared/ui';
import { useAuthorStats } from '../hooks';
import { AuthorOverviewProps } from '../model';

export const AuthorOverview = ({ timeRange }: AuthorOverviewProps) => {
  const { data, isLoading, isError, error, refetch } =
    useAuthorStats(timeRange);

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={() => refetch()}
        title="Error loading author statistics"
        icon={<FileText className="h-12 w-12 mx-auto" />}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title>Author Overview</Title>
            <Subtitle>Performance of your publications and activity</Subtitle>
          </div>
          <TimeFilter initialPeriod={timeRange} />
        </div>

        {isLoading || !data ? (
          <ListSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Posts"
              value={data.current.posts}
              icon={FileText}
              trend={data.changes.posts}
              description="Total posts created"
            />
            <StatCard
              title="Published"
              value={data.current.publishedPosts}
              icon={FileCheck2}
              trend={data.changes.publishedPosts}
              description="Published posts"
            />
            <StatCard
              title="Comments"
              value={data.current.comments}
              icon={MessageSquare}
              trend={data.changes.comments}
              description="Comments you wrote"
            />
            <StatCard
              title="Views"
              value={data.current.totalViews}
              icon={Eye}
              trend={data.changes.totalViews}
              description="Views on your posts"
            />
          </div>
        )}
      </div>
    </div>
  );
};
