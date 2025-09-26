'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { Button } from '@/shared/ui/button';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Перенаправляем пользователя на главную страницу
      router.push('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      setError('Произошла ошибка при завершении регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  // Составляем полное имя на клиенте
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Пользователь';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Добро пожаловать!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Завершите настройку вашего профиля
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Полное имя
              </label>
              <p className="mt-1 text-sm text-gray-900">{fullName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user.emailAddresses[0]?.emailAddress || 'Не указано'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCompleteOnboarding}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Завершение регистрации...' : 'Завершить регистрацию'}
          </Button>
        </div>
      </div>
    </div>
  );
}
