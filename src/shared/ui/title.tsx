import * as React from 'react';

import { cn } from '../lib';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('text-3xl font-bold tracking-tight', className)}
        {...props}
      />
    );
  }
);

Title.displayName = 'Title';

export { Title };
