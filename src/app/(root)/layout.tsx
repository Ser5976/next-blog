import { getCategories } from '@/entities/category';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <main>
      <Header />
      <div className=" grow  min-h-screen ">{children}</div>
      <Footer categories={categories} />
    </main>
  );
}
