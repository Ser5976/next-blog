export interface NavButtonProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  closeSheet?: () => void;
  exact?: boolean;
}

export interface DashboardSidebarProps {
  closeSheet?: () => void;
}
