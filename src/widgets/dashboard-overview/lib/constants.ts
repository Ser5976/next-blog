export const DASHBOARD_CONFIG = {
  title: 'Overview Panel',
  subtitle: 'Analytics for VitaFlowBlog',
  maxWidth: 'max-w-7xl',
} as const;

export const GRID_CONFIG = {
  stats: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
  },
  sections: {
    mobile: 'grid-cols-1',
    desktop: 'lg:grid-cols-2',
  },
} as const;
