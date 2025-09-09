'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { cn } from '@/shared/lib';

const categories = [
  { name: 'Fitness', href: '/fitness' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'Health', href: '/mental' },
];

export const Footer = () => {
  return (
    <footer
      className={cn('border-t border-border bg-background/70 backdrop-blur')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
        {/* Блок 1 — Логотип + описание */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold shadow">
              CX
            </div>
            <span className="font-semibold text-2xl">
              Createx<span className="text-primary">Blog</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A blog about healthy lifestyle, nutrition and training. We share
            experiences, inspire and help to be better every day.
          </p>
        </div>

        {/* Блок 2 — Навигация */}
        <div>
          <h4 className="font-semibold mb-3">Sections</h4>
          <nav className="flex flex-col gap-2">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Блок 3 — Соцсети */}
        <div>
          <h4 className="font-semibold mb-3">We are on social networks</h4>
          <div className="flex gap-4">
            <Link href="#" aria-label="Facebook" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="YouTube" className="hover:text-primary">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className="border-t border-border mt-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Createx Blog. Все права защищены.
      </div>
    </footer>
  );
};
