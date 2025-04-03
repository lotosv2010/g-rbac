import request from '../utils/request';
import { IResponse } from '../types/response';
import { IRole, IRolesResponse, IRolesParam } from '../types/role';

/**
 * 获取角色列表
 * @returns 角色列表响应
 */
export const getRoles = async (params?: IRolesParam) => {
  const response = await request.get<IResponse<IRolesResponse>>('/api/roles', { params });
  return response.data || {};
};

/**
 * 创建角色
 * @param params 创建角色参数
 * @returns 创建角色响应
 */
export const createRole = async (data: IRole) => {
  const response = await request.post<IResponse<IRole>>('/api/roles', data);
  return response.data || {};
};

/**
 * 更新角色
 * @param id 角色ID
 * @param params 更新角色参数
 * @returns 更新角色响应
 */
export const updateRole = async (id: number, data: IRole) => {
  const response = await request.put<IResponse>(`/api/roles/${id}`, data);
  return response.data || {};
};

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除角色响应
 */
export const deleteRole = async (id: number) => {
  const response = await request.delete<IResponse>(`/api/roles/${id}`);
  return response.data || {};
}; 