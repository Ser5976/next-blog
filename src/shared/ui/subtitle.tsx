import * as React from 'react';

import { cn } from '../lib';

type SubtitleProps = React.HTMLAttributes<HTMLParagraphElement>;

const Subtitle = React.forwardRef<HTMLParagraphElement, SubtitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-muted-foreground mt-1', className)}
        {...props}
      />
    );
  }
);

Subtitle.displayName = 'Subtitle';

export { Subtitle };
