import { Request, Response } from 'express';
import { ILike } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { AuthRequest } from '../types';
import { ActionLog } from '../models/ActionLog';

// 仓库
const roleRepository = AppDataSource.getRepository(Role);
const permissionRepository = AppDataSource.getRepository(Permission);
const actionLogRepository = AppDataSource.getRepository(ActionLog);

/**
 * 角色控制器
 * 处理角色相关的HTTP请求
 */
export class RoleController {
  /**
   * 获取所有角色
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async getRoles(req: Request, res: Response) {
    try {
      const name = req.query.name as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const where: any = {}
      if (name) {
        where.name = ILike(`%${name}%`);
      }

      const [roles, total] = await roleRepository.findAndCount({
        relations: ['permissions'],
        skip,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
        where
      });

      return res.status(200).json({
        success: true,
        message: '获取角色列表成功',
        data: {
          roles: roles.map(role => ({
            ...role,
            permissions: role.permissions.map(p => ({
              id: p.id,
              code: p.code,
              name: p.name,
            })),
          })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('获取角色列表错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取角色列表过程中发生错误',
      });
    }
  }

  /**
   * 获取单个角色
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async getRole(req: Request, res: Response) {
    try {
      const roleId = parseInt(req.params.id);

      const role = await roleRepository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
      });

      if (!role) {
        return res.status(404).json({
          success: false,
          message: '角色不存在',
        });
      }

      return res.status(200).json({
        success: true,
        message: '获取角色成功',
        data: {
          ...role,
          permissions: role.permissions.map(p => ({
            id: p.id,
            code: p.code,
            name: p.name,
          })),
        },
      });
    } catch (error) {
      console.error('获取角色错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取角色过程中发生错误',
      });
    }
  }

  /**
   * 创建角色
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async createRole(req: AuthRequest, res: Response) {
    try {
      const { name, description, permissionIds } = req.body;

      // 检查角色名是否已存在
      const existingRole = await roleRepository.findOne({
        where: { name },
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: '角色名已存在',
        });
      }

      // 获取指定的权限
      const permissions = await permissionRepository.findByIds(permissionIds || []);

      // 创建新角色
      const role = new Role();
      role.name = name;
      role.description = description;
      role.permissions = permissions;

      await roleRepository.save(role);

      // 记录操作日志
      const actionLog = new ActionLog();
      actionLog.action = 'CREATE';
      actionLog.module = 'ROLE';
      actionLog.description = `创建角色: ${name}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user!;
      await actionLogRepository.save(actionLog);

      return res.status(201).json({
        success: true,
        message: '创建角色成功',
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map(p => ({
            id: p.id,
            code: p.code,
            name: p.name,
          })),
        },
      });
    } catch (error) {
      console.error('创建角色错误:', error);
      return res.status(500).json({
        success: false,
        message: '创建角色过程中发生错误',
      });
    }
  }

  /**
   * 更新角色
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async updateRole(req: AuthRequest, res: Response) {
    try {
      const roleId = parseInt(req.params.id);
      const { name, description, permissionIds } = req.body;

      // 查找角色
      const role = await roleRepository.findOne({
        where: { id: roleId },
        relations: ['permissions'],
      });

      if (!role) {
        return res.status(404).json({
          success: false,
          message: '角色不存在',
        });
      }

      // 检查角色名是否已被其他角色使用
      if (name && name !== role.name) {
        const existingRole = await roleRepository.findOne({
          where: { name },
        });

        if (existingRole) {
          return res.status(400).json({
            success: false,
            message: '角色名已被使用',
          });
        }
      }

      // 更新角色信息
      if (name) role.name = name;
      if (description) role.description = description;

      // 更新权限
      if (permissionIds) {
        const permissions = await permissionRepository.findByIds(permissionIds);
        role.permissions = permissions;
      }

      await roleRepository.save(role);

      // 记录操作日志
      const actionLog = new ActionLog();
      actionLog.action = 'UPDATE';
      actionLog.module = 'ROLE';
      actionLog.description = `更新角色: ${role.name}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user!;
      await actionLogRepository.save(actionLog);

      return res.status(200).json({
        success: true,
        message: '更新角色成功',
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map(p => ({
            id: p.id,
            code: p.code,
            name: p.name,
          })),
        },
      });
    } catch (error) {
      console.error('更新角色错误:', error);
      return res.status(500).json({
        success: false,
        message: '更新角色过程中发生错误',
      });
    }
  }

  /**
   * 删除角色
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async deleteRole(req: AuthRequest, res: Response) {
    try {
      const roleId = parseInt(req.params.id);

      // 查找角色
      const role = await roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        return res.status(404).json({
          success: false,
          message: '角色不存在',
        });
      }

      // 记录要删除的角色名，用于日志
      const roleName = role.name;

      // 删除角色
      await roleRepository.remove(role);

      // 记录操作日志
      const actionLog = new ActionLog();
      actionLog.action = 'DELETE';
      actionLog.module = 'ROLE';
      actionLog.description = `删除角色: ${roleName}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user!;
      await actionLogRepository.save(actionLog);

      return res.status(200).json({
        success: true,
        message: '删除角色成功',
      });
    } catch (error) {
      console.error('删除角色错误:', error);
      return res.status(500).json({
        success: false,
        message: '删除角色过程中发生错误',
      });
    }
  }
} 