import { ThemeToggle } from '@/widgets/theme-toggle';

export default async function Auth() {
  return (
    <div className=" flex gap-4">
      <div className="">Привет,Login!!!</div>
      <ThemeToggle />
    </div>
  );
}
