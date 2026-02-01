import axios from 'axios';

import {
  ApiResponse,
  UpdateRoleParams,
  UsersFilters,
  UsersResponse,
} from '../model/types';

export async function getUsers(filters: UsersFilters): Promise<UsersResponse> {
  try {
    const { data } = await axios.get<UsersResponse>(
      '/api/dashboard/users-clerk',
      { params: filters }
    );
    return data;
  } catch (error) {
    console.error('getUsersClerk: error:', error);
    throw new Error('Something went wrong, the user was not received');
  }
}

export async function updateUserRole(
  params: UpdateRoleParams
): Promise<ApiResponse> {
  try {
    const { data } = await axios.patch<ApiResponse>(
      '/api/dashboard/users-clerk',
      { data: params }
    );

    return data;
  } catch (error) {
    console.error('updateUserRole: error:', error);
    throw new Error('Something went wrong, the role was not changet');
  }
}

export async function deleteUser(userId: string): Promise<ApiResponse> {
  try {
    const { data } = await axios.delete<ApiResponse>(
      `/api/dashboard/users-clerk/${userId}`
    );
    return data;
  } catch (error) {
    console.error('updateUserRole: error:', error);
    throw new Error('Something went wrong, the user was not deleted');
  }
}
