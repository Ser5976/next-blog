import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';

import { CategoriesMenu } from '@/features/categories-menu';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib';
import {
  Button,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

const categories = [
  { name: 'Fitness', href: '/fitness' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'Health', href: '/mental' },
];

export const Header = () => {
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
        <CategoriesMenu />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Поиск (на планшете/десктопе) */}
          <div className="hidden md:flex items-center gap-2 bg-muted/20 dark:bg-muted/10 rounded-full px-2 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="h-8 w-48 bg-transparent border-0 focus:ring-0 placeholder:opacity-80"
            />
          </div>

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

          {/* Мобильное меню через shadcn sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Открыть меню"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[75%] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex items-center gap-2 bg-muted/20 dark:bg-muted/10 rounded-full px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск..."
                  className="h-8 w-full bg-transparent border-0 focus:ring-0 placeholder:opacity-80"
                />
              </div>
              <nav className="mt-6 px-3 flex flex-col gap-4">
                {categories.map((c) => (
                  <SheetClose asChild key={c.name}>
                    <Link
                      href={c.href}
                      className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors uppercase"
                    >
                      {c.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  {isAuth ? (
                    <>
                      <Avatar>
                        <AvatarImage src="/avatar.png" alt="User avatar" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Имя пользователя</div>
                        <div className="text-sm text-muted-foreground">
                          user@example.com
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                      <div className="text-sm text-muted-foreground">Гость</div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
