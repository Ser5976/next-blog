import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Category, CategoryLink } from '@/entities/category';
import { cn } from '@/shared/lib';

interface FooterProps {
  categories: Category[] | undefined;
}

export const Footer = ({ categories }: FooterProps) => {
  return (
    <footer
      className={cn('border-t border-border bg-background/70 backdrop-blur')}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
        {/* Блок 1 — Логотип + описание */}
        <div
          className="flex flex-col gap-4"
          aria-labelledby="company-info-heading"
        >
          <h3 id="company-info-heading" className="sr-only">
            Company Information
          </h3>
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="VitaFlow Blog - Home page"
          >
            <div
              className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow"
              aria-hidden="true"
            >
              VF
            </div>
            <span className="font-semibold text-2xl">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                VitaFlow
              </span>
              <span className="text-foreground">Blog</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A blog about healthy lifestyle, nutrition and training. We share
            experiences, inspire and help to be better every day.
          </p>
        </div>

        {/* Блок 2 — Навигация */}
        <div aria-labelledby="sections-heading">
          <h4 id="sections-heading" className="font-semibold mb-3">
            Sections
          </h4>
          <nav aria-label="Категории блога">
            <ul className="flex flex-col gap-2" role="list">
              {!categories ? (
                <li
                  className="text-sm text-muted-foreground"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  ⚠️ What went wrong
                </li>
              ) : categories.length === 0 ? (
                <li
                  className="text-sm text-muted-foreground"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  No data available
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <CategoryLink category={category} />
                  </li>
                ))
              )}
            </ul>
          </nav>
        </div>

        {/* Блок 3 — Соцсети */}
        <div aria-labelledby="social-heading">
          <h4 id="social-heading" className="font-semibold mb-3">
            We are on social networks
          </h4>
          <div className="flex gap-4" role="list" aria-label="Social media">
            <Link
              href="#"
              aria-label="Facebook"
              className="hover:text-primary"
              role="listitem"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="hover:text-primary"
              role="listitem"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Twitter"
              className="hover:text-primary"
              role="listitem"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="YouTube"
              className="hover:text-primary"
              role="listitem"
            >
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div
        className="border-t border-border mt-6 py-4 text-center text-xs text-muted-foreground"
        aria-label="Copyright information"
      >
        © {new Date().getFullYear()} Createx Blog. All rights reserved.
      </div>
    </footer>
  );
};
