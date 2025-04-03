import request from '../utils/request';
import { ILoginParams, ILoginResponse } from '../types/auth';
import { IUser } from '../types/user';
import { IResponse } from '../types/response';

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export const login = async (data: ILoginParams) => {
  const response = await request.post<IResponse<ILoginResponse>>('/api/auth/login', data);
  return response.data || {};
};

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getCurrentUser = async () => {
  const response = await request.get<IResponse<IUser>>('/api/auth/current');
  return response.data || {};
};

/**
 * 退出登录
 */
export const logout = () => {
  localStorage.removeItem('token');
  delete request.defaults.headers.common['Authorization'];
}; 