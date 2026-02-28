import { act, renderHook } from '@testing-library/react';

import { useCustomDebounce } from '@/shared/hooks';
import { useComments, useDeleteComment, usePrefetchComments } from '..';
import { useCommentsManagement } from '../use-comments-management';

jest.mock('..', () => ({
  useComments: jest.fn(),
  useDeleteComment: jest.fn(),
  usePrefetchComments: jest.fn(),
}));

jest.mock('@/shared/hooks', () => ({ useCustomDebounce: jest.fn() }));

const mockedUseComments = useComments as jest.Mock;
const mockedUseDeleteComment = useDeleteComment as jest.Mock;
const mockedUsePrefetchComments = usePrefetchComments as jest.Mock;
const mockedUseCustomDebounce = useCustomDebounce as jest.Mock;

describe('useCommentsManagement', () => {
  const mockComments = [
    { id: '1', content: 'Comment 1' },
    { id: '2', content: 'Comment 2' },
  ];
  const mockRefetch = jest.fn();
  const mockPrefetch = jest.fn();
  const deleteCommentMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCustomDebounce.mockImplementation((v) => v);
    mockedUseComments.mockReturnValue({
      data: { comments: mockComments, total: 2, page: 1, totalPages: 3 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });
    mockedUseDeleteComment.mockReturnValue({
      mutate: deleteCommentMutate,
      isPending: false,
      variables: undefined,
    });
    mockedUsePrefetchComments.mockReturnValue(mockPrefetch);
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useCommentsManagement());
    expect(result.current.filters).toEqual({ page: 1, limit: 10 });
    expect(result.current.comments).toEqual(mockComments);
    expect(result.current.total).toBe(2);
    expect(result.current.totalPages).toBe(3);
  });

  it('should open and close delete dialog correctly', () => {
    const { result } = renderHook(() => useCommentsManagement());

    act(() => result.current.handleDeleteClick('1', 'Test content'));
    expect(result.current.deleteDialog).toEqual({
      open: true,
      commentId: '1',
      commentContent: 'Test content',
    });

    act(() => result.current.handleCancelDelete());
    expect(result.current.deleteDialog.open).toBe(false);
  });

  it('should call deleteComment mutation and close dialog on confirm', () => {
    const { result } = renderHook(() => useCommentsManagement());

    act(() => result.current.handleDeleteClick('1', 'Test content'));
    act(() => result.current.handleConfirmDelete());

    expect(deleteCommentMutate).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ onSettled: expect.any(Function) })
    );
  });

  it('should change page and prefetch next page', () => {
    const { result } = renderHook(() => useCommentsManagement());

    act(() => result.current.handlePageChange(2));
    expect(result.current.filters.page).toBe(2);
    expect(mockPrefetch).toHaveBeenCalledWith({
      page: 3,
      limit: 10,
      search: '',
    });
  });

  it('should reset page when items per page change', () => {
    const { result } = renderHook(() => useCommentsManagement());

    act(() => result.current.handleItemsPerPageChange(20));
    expect(result.current.filters).toEqual({ page: 1, limit: 20 });
  });

  it('should correctly detect deleting comments', () => {
    mockedUseDeleteComment.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
      variables: '2',
    });
    const { result } = renderHook(() => useCommentsManagement());

    expect(result.current.isCommentDeleting('2')).toBe(true);
    expect(result.current.isCommentDeleting('1')).toBe(false);
  });

  it('should refetch comments on refresh', () => {
    const { result } = renderHook(() => useCommentsManagement());
    act(() => result.current.handleRefresh());
    expect(mockRefetch).toHaveBeenCalled();
  });
});
