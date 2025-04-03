import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Permission } from '../models/Permission';
import { AuthRequest } from '../types';
import { ActionLog } from '../models/ActionLog';
import { ILike } from 'typeorm';

// 仓库
const permissionRepository = AppDataSource.getRepository(Permission);
const actionLogRepository = AppDataSource.getRepository(ActionLog);

/**
 * 获取所有权限
 */
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;
    const code = req.query.code as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where: any = {}

    if (name) {
      where.name = ILike(`%${name}%`);
    }
    if (code) {
      where.code = ILike(`%${code}%`);
    }
    const [permissions, total] = await permissionRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      where
    });

    return res.status(200).json({
      success: true,
      message: '获取权限列表成功',
      data: {
        permissions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('获取权限列表错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取权限列表过程中发生错误',
    });
  }
};

/**
 * 根据ID获取权限
 */
export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = parseInt(req.params.id);

    const permission = await permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: '权限不存在',
      });
    }

    return res.status(200).json({
      success: true,
      message: '获取权限成功',
      data: permission,
    });
  } catch (error) {
    console.error('获取权限错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取权限过程中发生错误',
    });
  }
};

/**
 * 创建权限
 */
export const createPermission = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, description, resourceType } = req.body;

    // 检查权限名或代码是否已存在
    const existingPermission = await permissionRepository.findOne({
      where: [{ name }, { code }],
    });

    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: '权限名或代码已存在',
      });
    }

    // 创建新权限
    const permission = new Permission();
    permission.name = name;
    permission.code = code;
    permission.description = description;
    permission.resourceType = resourceType;

    await permissionRepository.save(permission);

    // 记录操作日志
    if (req.user) {
      const actionLog = new ActionLog();
      actionLog.action = 'CREATE';
      actionLog.module = 'PERMISSION';
      actionLog.description = `创建权限: ${name}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user;
      await actionLogRepository.save(actionLog);
    }

    return res.status(201).json({
      success: true,
      message: '创建权限成功',
      data: {
        id: permission.id,
        name: permission.name,
        code: permission.code,
      },
    });
  } catch (error) {
    console.error('创建权限错误:', error);
    return res.status(500).json({
      success: false,
      message: '创建权限过程中发生错误',
    });
  }
};

/**
 * 更新权限
 */
export const updatePermission = async (req: AuthRequest, res: Response) => {
  try {
    const permissionId = parseInt(req.params.id);
    const { description, isActive, resourceType } = req.body;

    // 查找权限
    const permission = await permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: '权限不存在',
      });
    }

    // 更新权限信息
    if (description !== undefined) permission.description = description;
    if (isActive !== undefined) permission.isActive = isActive;
    if (resourceType !== undefined) permission.resourceType = resourceType;

    await permissionRepository.save(permission);

    // 记录操作日志
    if (req.user) {
      const actionLog = new ActionLog();
      actionLog.action = 'UPDATE';
      actionLog.module = 'PERMISSION';
      actionLog.description = `更新权限: ${permission.name}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user;
      await actionLogRepository.save(actionLog);
    }

    return res.status(200).json({
      success: true,
      message: '更新权限成功',
    });
  } catch (error) {
    console.error('更新权限错误:', error);
    return res.status(500).json({
      success: false,
      message: '更新权限过程中发生错误',
    });
  }
};

/**
 * 删除权限
 */
export const deletePermission = async (req: AuthRequest, res: Response) => {
  try {
    const permissionId = parseInt(req.params.id);

    // 查找权限
    const permission = await permissionRepository.findOne({
      where: { id: permissionId },
      relations: ['roles'],
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: '权限不存在',
      });
    }

    // 检查是否有角色使用此权限
    if (permission.roles && permission.roles.length > 0) {
      return res.status(400).json({
        success: false,
        message: `该权限正在被${permission.roles.length}个角色使用，无法删除`,
      });
    }

    // 记录要删除的权限名，用于日志
    const permissionName = permission.name;

    // 删除权限
    await permissionRepository.remove(permission);

    // 记录操作日志
    if (req.user) {
      const actionLog = new ActionLog();
      actionLog.action = 'DELETE';
      actionLog.module = 'PERMISSION';
      actionLog.description = `删除权限: ${permissionName}`;
      actionLog.ip = req.ip || '';
      actionLog.userAgent = req.headers['user-agent'] || '';
      actionLog.user = req.user;
      await actionLogRepository.save(actionLog);
    }

    return res.status(200).json({
      success: true,
      message: '删除权限成功',
    });
  } catch (error) {
    console.error('删除权限错误:', error);
    return res.status(500).json({
      success: false,
      message: '删除权限过程中发生错误',
    });
  }
}; 