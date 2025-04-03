import request from '../utils/request';
import { IUser, IUsersParam, IUsersResponse } from '../types/user';
import { IResponse } from '../types/response';

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async () => {
  return request.get<IResponse<IUser>>('/api/users/current');
};

/**
 * 获取用户列表
 */
export const getUsers = async (params?: IUsersParam) => {
  const response = await request.get<IResponse<IUsersResponse>>('/api/users', { params });
  return response.data || {};
};

/**
 * 创建用户
 */
export const createUser = async (data: IUser) => {
  const response = await request.post<IResponse<IUser>>('/api/users', data);
  return response.data || {};
};

/**
 * 更新用户
 */
export const updateUser = async (id: number, data: IUser) => {
  const response = await request.put<IResponse>(`/api/users/${id}`, data);
  return response.data || {};
};

/**
 * 删除用户
 */
export const deleteUser = async (id: number) => {
  const response = await request.delete<IResponse>(`/api/users/${id}`);
  return response.data || {};
}; 