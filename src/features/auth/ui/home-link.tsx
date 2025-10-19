import Link from 'next/link';

interface HomeLinkProps {
  className?: string;
}

export const HomeLink = ({ className }: HomeLinkProps) => {
  return (
    <div className={className}>
      <Link href="/" aria-label="Return to the main page">
        ← Home
      </Link>
    </div>
  );
};
