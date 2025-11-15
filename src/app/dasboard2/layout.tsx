import { ReactNode } from 'react';
import Link from 'next/link';

import { prisma } from '@/shared/api';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Проверяем наличие нерешённых ошибок удаления
  const failedCount = await prisma.failedUserDeletion.count({
    where: { resolved: false },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя панель */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">Админ-панель</h1>

        <nav className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-black">
            Главная
          </Link>

          <Link
            href="/dashboard/failed-deletions"
            className="relative text-gray-700 hover:text-black"
          >
            Неудачные удаления
            {failedCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {failedCount}
              </span>
            )}
          </Link>
          <Link
            href="/dasboard2/role-manager"
            className="text-gray-700 hover:text-black"
          >
            Role manager
          </Link>
        </nav>
      </header>

      {/* Предупреждение */}
      {failedCount > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 m-4 rounded-md">
          ⚠ Обнаружено {failedCount} неудачн{failedCount === 1 ? 'ое' : 'ых'}{' '}
          удалени
          {failedCount === 1 ? 'е' : 'й'}.{' '}
          <Link
            href="/dashboard/failed-deletions"
            className="underline font-medium hover:text-yellow-900"
          >
            Просмотреть
          </Link>
        </div>
      )}

      {/* Контент страницы */}
      <main className="p-6">{children}</main>
    </div>
  );
}
