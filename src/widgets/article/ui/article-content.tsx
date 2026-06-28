'use client';

import parse from 'html-react-parser';

import { cn } from '@/shared/lib/utils';

export const ArticleContent = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'prose prose-lg max-w-none dark:prose-invert',
        'prose-headings:scroll-mt-20 prose-headings:font-bold',
        'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl',
        'prose-p:text-gray-700 dark:prose-p:text-gray-300',
        'prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-xl prose-img:shadow-lg',
        'prose-pre:rounded-xl prose-pre:bg-gray-900',
        'prose-code:text-emerald-600 dark:prose-code:text-emerald-400',
        'prose-blockquote:border-l-emerald-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50',
        className
      )}
    >
      {parse(content)}
    </div>
  );
};
