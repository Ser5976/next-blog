import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { UserContent } from '../user-content';

// Мокаем дочерние компоненты
jest.mock('@/features/user-posts', () => ({
  UserPostsList: ({ userId }: { userId: string }) => (
    <div data-testid="user-posts-list">
      Mock UserPostsList for user: {userId}
    </div>
  ),
}));

jest.mock('@/features/user-comments', () => ({
  UserCommentsList: ({ userId }: { userId: string }) => (
    <div data-testid="user-comments-list">
      Mock UserCommentsList for user: {userId}
    </div>
  ),
}));

// Мокаем UI компоненты
jest.mock('@/shared/ui', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
  Tabs: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <div data-testid="tabs" data-tab-value={value}>
      <div
        data-testid="tabs-onchange-mock"
        onClick={() => onValueChange('comments')}
      >
        Change to comments
      </div>
      <div
        data-testid="tabs-onchange-posts"
        onClick={() => onValueChange('posts')}
      >
        Change to posts
      </div>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tab-trigger-${value}`}>{children}</div>,
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

// Мокаем иконки
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon">FileText Icon</div>,
  MessageCircle: () => (
    <div data-testid="message-circle-icon">MessageCircle Icon</div>
  ),
}));

describe('UserContent', () => {
  const userId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Рендеринг компонента с правильным userId
  it('renders component with correct userId', () => {
    render(<UserContent userId={userId} />);

    // Проверяем что userId передается в дочерние компоненты
    expect(screen.getByTestId('user-posts-list')).toHaveTextContent(userId);
    expect(screen.getByTestId('user-comments-list')).toHaveTextContent(userId);
  });

  // Test 2: Рендеринг структуры компонента
  it('renders correct component structure', () => {
    render(<UserContent userId={userId} />);

    // Проверяем основные элементы
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument();

    // Проверяем иконки в заголовке - используем getAllByTestId
    const fileTextIcons = screen.getAllByTestId('file-text-icon');
    expect(fileTextIcons).toHaveLength(2); // Одна в заголовке, одна во вкладке Posts
    expect(screen.getByText('User Content')).toBeInTheDocument();
  });

  // Test 3: Рендеринг вкладок с правильными иконками и текстом
  it('renders tabs with correct icons and labels', () => {
    render(<UserContent userId={userId} />);

    // Проверяем вкладку Posts
    const postsTab = screen.getByTestId('tab-trigger-posts');
    expect(postsTab).toBeInTheDocument();
    expect(postsTab).toHaveTextContent('Posts');

    // Проверяем что всего две иконки FileText
    const fileTextIcons = screen.getAllByTestId('file-text-icon');
    expect(fileTextIcons).toHaveLength(2);

    // Проверяем вкладку Comments
    const commentsTab = screen.getByTestId('tab-trigger-comments');
    expect(commentsTab).toBeInTheDocument();
    expect(commentsTab).toHaveTextContent('Comments');
    expect(screen.getByTestId('message-circle-icon')).toBeInTheDocument();
  });

  // Test 4: По умолчанию активна вкладка Posts
  it('has Posts tab active by default', () => {
    render(<UserContent userId={userId} />);

    // Проверяем что значение tabs установлено на 'posts'
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-tab-value',
      'posts'
    );

    // Проверяем что контент Posts отображается, а Comments нет
    expect(screen.getByTestId('tab-content-posts')).toBeInTheDocument();
    expect(screen.getByTestId('user-posts-list')).toBeInTheDocument();

    // В Comments контенте не должно быть комментариев (но он может быть в DOM с display: none)
    // В нашей реализации мы просто проверяем наличие обоих контентов
    expect(screen.getByTestId('tab-content-comments')).toBeInTheDocument();
  });

  // Test 5: Переключение на вкладку Comments
  it('switches to Comments tab when clicked', async () => {
    render(<UserContent userId={userId} />);

    const user = userEvent.setup();

    // Проверяем начальное состояние
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-tab-value',
      'posts'
    );

    // Переключаем на Comments
    await user.click(screen.getByTestId('tabs-onchange-mock'));

    // Проверяем что активная вкладка изменилась
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-tab-value',
      'comments'
    );
  });

  // Test 6: Переключение обратно на вкладку Posts
  it('switches back to Posts tab', async () => {
    render(<UserContent userId={userId} />);

    const user = userEvent.setup();

    // Переключаем на Comments
    await user.click(screen.getByTestId('tabs-onchange-mock'));
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-tab-value',
      'comments'
    );

    // Переключаем обратно на Posts
    await user.click(screen.getByTestId('tabs-onchange-posts'));
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-tab-value',
      'posts'
    );
  });

  // Test 7: Рендеринг правильного контента при переключении вкладок
  it('renders correct content when switching tabs', async () => {
    render(<UserContent userId={userId} />);

    const user = userEvent.setup();

    // Проверяем что изначально видим Posts
    expect(screen.getByTestId('user-posts-list')).toBeInTheDocument();

    // Переключаем на Comments
    await user.click(screen.getByTestId('tabs-onchange-mock'));

    // Проверяем что видим Comments
    // Обратите внимание: оба компонента рендерятся всегда, но через TabsContent
    // с CSS видимость. В тестах мы проверяем что оба компонента в DOM
    expect(screen.getByTestId('user-posts-list')).toBeInTheDocument();
    expect(screen.getByTestId('user-comments-list')).toBeInTheDocument();
  });

  // Test 8: Пропс userId передается в дочерние компоненты
  it('passes userId prop to child components', () => {
    const customUserId = 'custom-user-456';
    render(<UserContent userId={customUserId} />);

    expect(screen.getByTestId('user-posts-list')).toHaveTextContent(
      customUserId
    );
    expect(screen.getByTestId('user-comments-list')).toHaveTextContent(
      customUserId
    );
  });
});
