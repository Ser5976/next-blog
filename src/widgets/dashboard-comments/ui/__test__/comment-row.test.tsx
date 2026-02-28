import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { getFullName } from '@/features/user-profile-info';
import { formatDate } from '@/shared/lib';
import { CommentRow } from '../comment-row';

// Мок для функции cn
jest.mock('@/shared/lib', () => ({
  ...jest.requireActual('@/shared/lib'),
  cn: jest.fn((...inputs) => inputs.filter(Boolean).join(' ')),
  formatDate: jest.fn(),
}));

jest.mock('@/features/user-profile-info', () => ({ getFullName: jest.fn() }));

// Мок для DropdownMenu компонентов
jest.mock('@/shared/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: any) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button data-testid="delete-comment-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
  FileText: () => <svg data-testid="file-text-icon" />,
  Loader2: () => <svg data-testid="loader-icon" />,
  Mail: () => <svg data-testid="mail-icon" />,
  MoreVertical: () => <svg data-testid="more-icon" />,
  ThumbsDown: () => <svg data-testid="thumbs-down-icon" />,
  ThumbsUp: () => <svg data-testid="thumbs-up-icon" />,
  User: () => <svg data-testid="user-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

const mockComment = {
  id: 'comment-1',
  content:
    'This is a test comment that is long enough to test truncation functionality when content exceeds 200 characters. '.repeat(
      5
    ),
  createdAt: 1670000000000,
  updatedAt: 1680000000000,
  author: {
    id: 'user-1',
    email: 'author@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    imageUrl: 'https://img.test/avatar.png',
    createdAt: null,
    lastSignInAt: null,
  },
  post: {
    id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    published: true,
  },
  stats: { likesCount: 5, dislikesCount: 2 },
};

const defaultProps = { comment: mockComment, onDelete: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
  (getFullName as jest.Mock).mockReturnValue('John Doe');
  (formatDate as jest.Mock).mockImplementation((v) => `formatted-${v}`);
});

describe('CommentRow', () => {
  it('renders comment information', () => {
    render(<CommentRow {...defaultProps} />);

    expect(screen.getByTestId('comment-author-name')).toHaveTextContent(
      'John Doe'
    );
    expect(screen.getByTestId('comment-author-email')).toHaveTextContent(
      mockComment.author.email
    );
    expect(screen.getByTestId('comment-content')).toBeInTheDocument();

    // Ищем ссылку на пост по тексту, а не по data-testid
    const postLink = screen.getByRole('link', { name: mockComment.post.title });
    expect(postLink).toBeInTheDocument();
    expect(postLink).toHaveAttribute('href', '/posts/test-post');
  });

  it('renders avatar placeholder when image is missing', () => {
    render(
      <CommentRow
        {...defaultProps}
        comment={{
          ...mockComment,
          author: { ...mockComment.author, imageUrl: '' },
        }}
      />
    );
    expect(
      screen.getByTestId('comment-author-avatar-placeholder')
    ).toBeInTheDocument();
  });

  it('shows formatted date and edited indicator', () => {
    render(<CommentRow {...defaultProps} />);
    expect(formatDate).toHaveBeenCalledWith(mockComment.createdAt);
    expect(screen.getByText(/edited/i)).toBeInTheDocument();
  });

  it('truncates long content', () => {
    render(<CommentRow {...defaultProps} />);
    const content = screen.getByTestId('comment-content');
    expect(content.textContent?.endsWith('...')).toBe(true);
  });

  it('calls onDelete from actions menu', async () => {
    render(<CommentRow {...defaultProps} />);

    // Кликаем по кнопке открытия меню
    fireEvent.click(screen.getByTestId('comment-actions-button'));

    // Ждем появления кнопки удаления и кликаем по ней
    await waitFor(() => {
      expect(screen.getByTestId('delete-comment-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-comment-button'));

    expect(defaultProps.onDelete).toHaveBeenCalledWith(
      mockComment.id,
      mockComment.content
    );
  });

  it('disables actions while deleting', () => {
    render(<CommentRow {...defaultProps} isDeleting />);
    expect(screen.getByTestId('comment-actions-button')).toBeDisabled();
  });
});
