import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { ICommentsStats } from '../../model';
import { CommentsStats } from '../comments-stats';

// Создаем тестовые данные статистики
const createMockStats = (
  overrides?: Partial<ICommentsStats>
): ICommentsStats => ({
  totalComments: 150,
  totalLikes: 1200,
  totalDislikes: 50,
  postsCommented: 42,
  ...overrides,
});

describe('CommentsStats – unit tests', () => {
  // Test 1: Базовый рендеринг компонента
  it('renders all statistics items correctly', () => {
    const stats = createMockStats();
    render(<CommentsStats stats={stats} />);

    // Проверяем что все элементы статистики отображаются
    expect(screen.getByTestId('total-comments')).toBeInTheDocument();
    expect(screen.getByTestId('total-likes')).toBeInTheDocument();
    expect(screen.getByTestId('total-dislikes')).toBeInTheDocument();
    expect(screen.getByTestId('posts-commented')).toBeInTheDocument();

    // Проверяем accessibility атрибуты
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'User comments statistics');
  });

  // Test 2: Отображение правильных значений
  it('displays correct values for each statistic', () => {
    const stats = createMockStats();
    render(<CommentsStats stats={stats} />);

    // Проверяем значения (используем regex для разных форматов toLocaleString)
    expect(screen.getByTestId('total-comments-value')).toHaveTextContent('150');
    expect(screen.getByTestId('total-likes-value').textContent).toMatch(
      /1[,\s]?200/
    ); // Может быть "1,200" или "1 200"
    expect(screen.getByTestId('total-dislikes-value')).toHaveTextContent('50');
    expect(screen.getByTestId('posts-commented-value')).toHaveTextContent('42');

    // Проверяем labels
    expect(screen.getByTestId('total-comments-label')).toHaveTextContent(
      'Total Comments'
    );
    expect(screen.getByTestId('total-likes-label')).toHaveTextContent(
      'Total Likes'
    );
    expect(screen.getByTestId('total-dislikes-label')).toHaveTextContent(
      'Total Dislikes'
    );
    expect(screen.getByTestId('posts-commented-label')).toHaveTextContent(
      'Posts Commented'
    );
  });

  // Test 3: Форматирование чисел с большими значениями
  it('formats large numbers correctly for total likes', () => {
    const stats = createMockStats({ totalLikes: 125000 });
    render(<CommentsStats stats={stats} />);

    const totalLikesValue = screen.getByTestId('total-likes-value');
    // Метод toLocaleString() может возвращать разные форматы в зависимости от локали
    // Проверяем что содержит число 125000 в каком-либо формате
    expect(totalLikesValue.textContent).toMatch(/125[,\s]?000|125000/);
  });

  // Test 4: Форматирование чисел с большими значениями для комментариев
  it('formats large numbers correctly for total comments', () => {
    const stats = createMockStats({ totalComments: 125000 });
    render(<CommentsStats stats={stats} />);

    const totalCommentsValue = screen.getByTestId('total-comments-value');
    expect(totalCommentsValue.textContent).toMatch(/125[,\s]?000|125000/);
  });

  // Test 5: Accessibility атрибуты для каждого элемента
  it('has proper aria-label for each stat item', () => {
    const stats = createMockStats();
    render(<CommentsStats stats={stats} />);

    // Проверяем aria-label для каждого элемента
    const totalCommentsItem = screen.getByTestId('total-comments');
    expect(totalCommentsItem).toHaveAttribute(
      'aria-label',
      'Total comments: 150'
    );

    const totalLikesItem = screen.getByTestId('total-likes');
    expect(totalLikesItem).toHaveAttribute(
      'aria-label',
      'Total likes on comments: 1200'
    );

    const totalDislikesItem = screen.getByTestId('total-dislikes');
    expect(totalDislikesItem).toHaveAttribute(
      'aria-label',
      'Total dislikes on comments: 50'
    );

    const postsCommentedItem = screen.getByTestId('posts-commented');
    expect(postsCommentedItem).toHaveAttribute(
      'aria-label',
      'Number of posts commented on: 42'
    );
  });

  // Test 6: Рендеринг с нулевыми значениями
  it('handles zero values correctly', () => {
    const stats = createMockStats({
      totalComments: 0,
      totalLikes: 0,
      totalDislikes: 0,
      postsCommented: 0,
    });

    render(<CommentsStats stats={stats} />);

    expect(screen.getByTestId('total-comments-value')).toHaveTextContent('0');
    expect(screen.getByTestId('total-likes-value')).toHaveTextContent('0');
    expect(screen.getByTestId('total-dislikes-value')).toHaveTextContent('0');
    expect(screen.getByTestId('posts-commented-value')).toHaveTextContent('0');
  });

  // Test 7: Рендеринг с очень большими числами
  it('handles very large numbers correctly', () => {
    const stats = createMockStats({
      totalComments: 1000000,
      totalLikes: 5000000,
    });

    render(<CommentsStats stats={stats} />);

    const totalCommentsValue = screen.getByTestId('total-comments-value');
    const totalLikesValue = screen.getByTestId('total-likes-value');

    // Проверяем форматирование миллиона
    expect(totalCommentsValue.textContent).toMatch(
      /1[,\s]?000[,\s]?000|1000000/
    );
    expect(totalLikesValue.textContent).toMatch(/5[,\s]?000[,\s]?000|5000000/);
  });

  // Test 8: Правильная структура DOM
  it('has correct DOM structure with proper classes', () => {
    const stats = createMockStats();
    render(<CommentsStats stats={stats} />);

    const container = screen.getByRole('region');
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('grid-cols-2');
    expect(container).toHaveClass('sm:grid-cols-3');
    expect(container).toHaveClass('lg:grid-cols-4');

    // Проверяем структуру каждого элемента статистики
    // Нужно брать родительские элементы, а не элементы с значениями
    const statContainers = [
      screen.getByTestId('total-comments'),
      screen.getByTestId('total-likes'),
      screen.getByTestId('total-dislikes'),
      screen.getByTestId('posts-commented'),
    ];

    statContainers.forEach((item) => {
      expect(item).toHaveClass('bg-muted/30');
      expect(item).toHaveClass('rounded-lg');
      expect(item).toHaveClass('p-3');
      expect(item).toHaveClass('text-center');
    });
  });
});
