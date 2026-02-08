import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { IPostsStats } from '../../model';
import { PostsStats } from '../posts-stats';

// Создаем тестовые данные статистики
const createMockStats = (overrides?: Partial<IPostsStats>): IPostsStats => ({
  totalPosts: 42,
  publishedPosts: 35,
  totalViews: 125000,
  averageRating: 4.2,
  totalRatings: 500,
  ...overrides,
});

describe('PostsStats – unit tests', () => {
  // Test 1: Базовый рендеринг компонента
  it('renders all statistics items correctly', () => {
    const stats = createMockStats();
    render(<PostsStats stats={stats} />);

    // Проверяем что все элементы статистики отображаются
    expect(screen.getByTestId('total-posts-stat')).toBeInTheDocument();
    expect(screen.getByTestId('published-posts-stat')).toBeInTheDocument();
    expect(screen.getByTestId('total-views-stat')).toBeInTheDocument();
    expect(screen.getByTestId('avg-rating-stat')).toBeInTheDocument();
    expect(screen.getByTestId('total-ratings-stat')).toBeInTheDocument();

    // Проверяем accessibility атрибуты
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'User posts statistics');
  });

  // Test 2: Отображение правильных значений
  it('displays correct values for each statistic', () => {
    const stats = createMockStats();
    render(<PostsStats stats={stats} />);

    // Проверяем значения
    expect(screen.getByTestId('total-posts-stat-value')).toHaveTextContent(
      '42'
    );
    expect(screen.getByTestId('published-posts-stat-value')).toHaveTextContent(
      '35'
    );
    expect(screen.getByTestId('total-ratings-stat-value')).toHaveTextContent(
      '500'
    );

    // Проверяем labels
    expect(screen.getByTestId('total-posts-stat-label')).toHaveTextContent(
      'Total Posts'
    );
    expect(screen.getByTestId('published-posts-stat-label')).toHaveTextContent(
      'Published'
    );
    expect(screen.getByTestId('avg-rating-stat-label')).toHaveTextContent(
      'Avg Rating'
    );
  });

  // Test 3: Форматирование чисел с большими значениями
  it('formats large numbers correctly for total views', () => {
    const stats = createMockStats({ totalViews: 125000 });
    render(<PostsStats stats={stats} />);

    const totalViewsValue = screen.getByTestId('total-views-stat-value');
    // Метод toLocaleString() может возвращать разные форматы в зависимости от локали
    // Проверяем что содержит число 125000 в каком-либо формате
    expect(totalViewsValue.textContent).toMatch(/125[,\s]?000|125000/);
  });

  // Test 4: Форматирование рейтинга с одним десятичным знаком
  it('formats average rating with one decimal place', () => {
    const stats = createMockStats({ averageRating: 4.2 });
    render(<PostsStats stats={stats} />);

    const avgRatingValue = screen.getByTestId('avg-rating-stat-value');
    expect(avgRatingValue.textContent).toBe('4.2');
  });

  // Test 5: Округление рейтинга
  it('rounds average rating to one decimal place', () => {
    const stats = createMockStats({ averageRating: 4.256 });
    render(<PostsStats stats={stats} />);

    const avgRatingValue = screen.getByTestId('avg-rating-stat-value');
    expect(avgRatingValue.textContent).toBe('4.3');
  });

  // Test 6: Обработка рейтинга с нулем после запятой
  it('shows one decimal place even when rating is whole number', () => {
    const stats = createMockStats({ averageRating: 5 });
    render(<PostsStats stats={stats} />);

    const avgRatingValue = screen.getByTestId('avg-rating-stat-value');
    expect(avgRatingValue.textContent).toBe('5.0');
  });

  // Test 7: Accessibility атрибуты для каждого элемента
  it('has proper aria-label for each stat item', () => {
    const stats = createMockStats();
    render(<PostsStats stats={stats} />);

    // Проверяем aria-label для каждого элемента
    const totalPostsItem = screen.getByTestId('total-posts-stat');
    expect(totalPostsItem).toHaveAttribute('aria-label', 'Total posts: 42');

    const publishedPostsItem = screen.getByTestId('published-posts-stat');
    expect(publishedPostsItem).toHaveAttribute(
      'aria-label',
      'Published posts: 35'
    );

    const totalViewsItem = screen.getByTestId('total-views-stat');
    // toLocaleString может возвращать разные форматы
    expect(totalViewsItem).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Total views:')
    );
  });

  // Test 8: Рендеринг с нулевыми значениями
  it('handles zero values correctly', () => {
    const stats = createMockStats({
      totalPosts: 0,
      publishedPosts: 0,
      totalViews: 0,
      averageRating: 0,
      totalRatings: 0,
    });

    render(<PostsStats stats={stats} />);

    expect(screen.getByTestId('total-posts-stat-value')).toHaveTextContent('0');
    expect(screen.getByTestId('published-posts-stat-value')).toHaveTextContent(
      '0'
    );
    expect(screen.getByTestId('total-views-stat-value')).toHaveTextContent('0');
    expect(screen.getByTestId('avg-rating-stat-value')).toHaveTextContent(
      '0.0'
    );
    expect(screen.getByTestId('total-ratings-stat-value')).toHaveTextContent(
      '0'
    );
  });

  // Test 9: Рендеринг с очень большими числами
  it('handles very large numbers correctly', () => {
    const stats = createMockStats({
      totalViews: 1000000,
      totalRatings: 10000,
    });

    render(<PostsStats stats={stats} />);

    const totalViewsValue = screen.getByTestId('total-views-stat-value');
    // Проверяем форматирование миллиона
    expect(totalViewsValue.textContent).toMatch(/1[,\s]?000[,\s]?000|1000000/);

    expect(screen.getByTestId('total-ratings-stat-value')).toHaveTextContent(
      '10000'
    );
  });

  // Test 10: Рендеринг с отрицательным рейтингом (edge case)
  it('handles negative average rating', () => {
    const stats = createMockStats({ averageRating: -1.5 });
    render(<PostsStats stats={stats} />);

    const avgRatingValue = screen.getByTestId('avg-rating-stat-value');
    expect(avgRatingValue.textContent).toBe('-1.5');
  });

  // Test 11: Правильная структура DOM
  it('has correct DOM structure with proper classes', () => {
    const stats = createMockStats();
    render(<PostsStats stats={stats} />);

    const container = screen.getByRole('region');
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('grid-cols-2');
    expect(container).toHaveClass('sm:grid-cols-3');
    expect(container).toHaveClass('lg:grid-cols-5');

    // Проверяем структуру каждого элемента статистики
    const statItems = screen.getAllByTestId(/stat$/);
    statItems.forEach((item) => {
      expect(item).toHaveClass('bg-muted/30');
      expect(item).toHaveClass('rounded-lg');
      expect(item).toHaveClass('p-3');
      expect(item).toHaveClass('text-center');
    });
  });
});
