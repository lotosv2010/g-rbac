import request from '../utils/request';
import { IResponse } from '../types/response';
import { IPermission, IPermissionsParam, IPermissionsResponse } from '../types/permission';

/**
 * 获取权限列表
 */
export const getPermissions = async (params?: IPermissionsParam) => {
  const response = await request.get<IResponse<IPermissionsResponse>>('/api/permissions', { params });
  return response.data || {};
};

/**
 * 创建权限
 */
export const createPermission = async (data: IPermission) => {
  const response = await request.post<IResponse<IPermission>>('/api/permissions', data);
  return response.data || {};
};

/**
 * 更新权限
 */
export const updatePermission = async (id: number, data: IPermission) => {
  const response = await request.put<IResponse>(`/api/permissions/${id}`, data);
  return response.data || {};
};

/**
 * 删除权限
 */
export const deletePermission = async (id: number) => {
  const response = await request.delete<IResponse>(`/api/permissions/${id}`);
  return response.data || {};
}; 