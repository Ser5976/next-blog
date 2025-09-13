'use client';

import { useState } from 'react';
import { Menu, User } from 'lucide-react';

import { Category, CategoryLink } from '@/entities/category';
import { SearchForm } from '@/features/search';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

interface HeaderProps {
  categories: Category[] | undefined;
}

export const MobileMenu = ({ categories }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const isAuth = false; // Заглушка авторизации

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[75%] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <nav className="mt-6 px-3 flex flex-col gap-4">
          <SearchForm variant="mobile" onClose={() => setOpen(false)} />
          <ul className="flex px-2  flex-col gap-4" role="list">
            {!categories ? (
              <li className="text-sm text-muted-foreground">
                ⚠️ What went wrong
              </li>
            ) : categories.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                No data available
              </li>
            ) : (
              categories.map((category) => (
                <li key={category.id} onClick={() => setOpen(false)}>
                  <CategoryLink category={category} />
                </li>
              ))
            )}
          </ul>
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
              <div className="flex items-center gap-3 pb-4">
                <Button variant="ghost" size="icon">
                  <User className="h-15 w-15 text-muted-foreground" />
                </Button>
                <div className="text-sm text-muted-foreground">Гость</div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
