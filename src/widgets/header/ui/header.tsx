import Link from 'next/link';
import { User } from 'lucide-react';

import { Category } from '@/entities/category';
import { CategoriesMenu } from '@/features/categories-menu';
import { SearchForm } from '@/features/search';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { MobileMenu } from '@/widgets/mobile-menu';

interface HeaderProps {
  categories: Category[] | undefined;
}

export const Header = ({ categories }: HeaderProps) => {
  const isAuth = false; // Заглушка авторизации

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border',
        'bg-background/70 backdrop-blur'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold shadow">
            CX
          </div>
          <span className="font-semibold text-2xl">
            Createx<span className="text-primary">Blog</span>
          </span>
        </Link>

        {/* Десктоп-навигация */}
        <CategoriesMenu categories={categories} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Поиск (на планшете/десктопе) */}
          <SearchForm />

          {/* Переключатель темы */}
          <ThemeToggle />

          {/* Аватар / иконка пользователя */}
          <div className="hidden sm:block">
            {isAuth ? (
              <Avatar>
                <AvatarImage src="/avatar.png" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Аккаунт"
                className=" cursor-pointer"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Мобильное меню  */}
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
};
