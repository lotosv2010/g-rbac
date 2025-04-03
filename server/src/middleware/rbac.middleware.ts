import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Permission } from '../models/Permission';

/**
 * 检查是否拥有指定权限的中间件
 * @param permissionCode 权限代码
 */
export const hasPermission = (permissionCode: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户未认证',
        });
      }

      // 检查用户是否有超级管理员角色
      const isAdmin = user.roles.some(role => role.name === 'admin');
      
      if (isAdmin) {
        // 超级管理员拥有所有权限
        return next();
      }

      // 检查用户的角色是否具有所需权限
      const hasRequiredPermission = user.roles.some(role => 
        role.permissions.some((permission: Permission) => permission.code === permissionCode)
      );

      if (hasRequiredPermission) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: '您没有执行此操作的权限',
      });
    } catch (error) {
      console.error('权限验证错误:', error);
      return res.status(500).json({
        success: false,
        message: '权限验证过程中发生错误',
      });
    }
  };
};

/**
 * 检查是否拥有指定角色的中间件
 * @param roleName 角色名称
 */
export const hasRole = (roleName: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户未认证',
        });
      }

      // 检查用户是否有指定角色
      const hasRequiredRole = user.roles.some(role => role.name === roleName);

      if (hasRequiredRole) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: '您没有执行此操作的权限',
      });
    } catch (error) {
      console.error('角色验证错误:', error);
      return res.status(500).json({
        success: false,
        message: '角色验证过程中发生错误',
      });
    }
  };
}; 