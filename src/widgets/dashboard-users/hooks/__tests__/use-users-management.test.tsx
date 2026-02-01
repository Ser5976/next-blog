import { act, renderHook } from '@testing-library/react';

import {
  useCustomDebounce,
  useDeleteUser,
  usePrefetchUsers,
  useUpdateRole,
  useUsers,
} from '..';
import { useUsersManagement } from '../use-users-management';

// mocks

jest.mock('..', () => ({
  useCustomDebounce: jest.fn(),
  useUsers: jest.fn(),
  useUpdateRole: jest.fn(),
  useDeleteUser: jest.fn(),
  usePrefetchUsers: jest.fn(),
}));

const mockedUseUsers = useUsers as jest.Mock;
const mockedUseUpdateRole = useUpdateRole as jest.Mock;
const mockedUseDeleteUser = useDeleteUser as jest.Mock;
const mockedUsePrefetchUsers = usePrefetchUsers as jest.Mock;
const mockedUseCustomDebounce = useCustomDebounce as jest.Mock;

describe('useUsersManagement', () => {
  const mockUsers = [
    { id: '1', email: 'a@test.com', role: 'user' },
    { id: '2', email: 'b@test.com', role: 'admin' },
  ];

  const mockRefetch = jest.fn();
  const mockPrefetch = jest.fn();

  const updateRoleMutate = jest.fn();
  const deleteUserMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseCustomDebounce.mockImplementation((v) => v);

    mockedUseUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
        page: 1,
        totalPages: 3,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isFetching: false,
    });

    mockedUseUpdateRole.mockReturnValue({
      mutate: updateRoleMutate,
      isPending: false,
      variables: undefined,
    });

    mockedUseDeleteUser.mockReturnValue({
      mutate: deleteUserMutate,
      isPending: false,
      variables: undefined,
    });

    mockedUsePrefetchUsers.mockReturnValue(mockPrefetch);
  });

  // 1. initial state

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useUsersManagement());

    expect(result.current.filters).toEqual({ page: 1, limit: 10 });
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.total).toBe(2);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.isLoading).toBe(false);
  });

  // 2. role change handler

  it('should call updateRole mutation on role change', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handleRoleChange('1', 'admin');
    });

    expect(updateRoleMutate).toHaveBeenCalledWith({
      userId: '1',
      newRole: 'admin',
    });
  });

  // 3. delete dialog flow

  it('should open and close delete dialog correctly', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handleDeleteClick('1', 'a@test.com');
    });

    expect(result.current.deleteDialog).toEqual({
      open: true,
      userId: '1',
      userEmail: 'a@test.com',
    });

    act(() => {
      result.current.handleCancelDelete();
    });

    expect(result.current.deleteDialog.open).toBe(false);
  });

  // 4. confirm delete

  it('should call deleteUser mutation and close dialog on confirm', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handleDeleteClick('1', 'a@test.com');
    });

    act(() => {
      result.current.handleConfirmDelete();
    });

    expect(deleteUserMutate).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        onSettled: expect.any(Function),
      })
    );
  });

  // 5. pagination + prefetch

  it('should change page and prefetch next page', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.filters.page).toBe(2);

    expect(mockPrefetch).toHaveBeenCalledWith({
      page: 3,
      limit: 10,
      emailSearch: '',
    });
  });

  // 6. items per page

  it('should reset page when items per page change', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handleItemsPerPageChange(20);
    });

    expect(result.current.filters).toEqual({
      page: 1,
      limit: 20,
    });
  });

  // 7. helpers

  it('should correctly detect updating and deleting users', () => {
    mockedUseUpdateRole.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
      variables: { userId: '1' },
    });

    mockedUseDeleteUser.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
      variables: '2',
    });

    const { result } = renderHook(() => useUsersManagement());

    expect(result.current.isUserUpdatingRole('1')).toBe(true);
    expect(result.current.isUserUpdatingRole('2')).toBe(false);

    expect(result.current.isUserDeleting('2')).toBe(true);
    expect(result.current.isUserDeleting('1')).toBe(false);
  });

  // 8. refresh

  it('should refetch users on refresh', () => {
    const { result } = renderHook(() => useUsersManagement());

    act(() => {
      result.current.handleRefresh();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
