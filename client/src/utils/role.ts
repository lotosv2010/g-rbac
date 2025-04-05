import { IRole } from '../types/role';

// 设置用户角色
export const setUserRoles = (roles: IRole[]) => {
  // 设置到localStorage
  localStorage.setItem('userRoles', JSON.stringify(roles));
};

// 获取用户角色列表
export const getUserRoles = (): IRole[] => {
  return JSON.parse(localStorage.getItem('userRoles') || '[]') as IRole[];
};

// 检查是否有指定角色
export const hasRole = (roleName: string): boolean => {
  const roles = getUserRoles();
  return roles.some(role => role.name === roleName);
};

// 检查是否有多个角色中的任意一个
export const hasAnyRole = (roleNames: string[]): boolean => {
  return roleNames.some(name => hasRole(name));
};

// 检查是否同时拥有多个角色
export const hasAllRoles = (roleNames: string[]): boolean => {
  return roleNames.every(name => hasRole(name));
};