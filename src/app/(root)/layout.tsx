import { Footer, Header } from '@/widgets';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className=" grow  min-h-screen ">{children}</div>
      <Footer />
    </main>
  );
}
