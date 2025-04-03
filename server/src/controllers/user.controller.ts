import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { AuthRequest } from '../types';
import { ActionLog } from '../models/ActionLog';
import { ILike } from 'typeorm';

// 仓库
const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const actionLogRepository = AppDataSource.getRepository(ActionLog);

/**
 * 获取所有用户
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;
    const email = req.query.email as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (username) {
      where.username =  ILike(`%${username}%`);
    }
    if (email) {
      where.email =  ILike(`%${email}%`);
    }

    const [users, total] = await userRepository.findAndCount({
      select: ['id', 'username', 'email', 'phone', 'isActive', 'lastLogin', 'createdAt', 'updatedAt'],
      relations: ['roles'],
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      where
    });

    return res.status(200).json({
      success: true,
      message: '获取用户列表成功',
      data: {
        users: users.map(user => ({
          ...user,
          roles: user.roles.map(role => ({
            id: role.id,
            name: role.name,
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
    console.error('获取用户列表错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户列表过程中发生错误',
    });
  }
};

/**
 * 根据ID获取用户
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    return res.status(200).json({
      success: true,
      message: '获取用户成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name,
        })),
      },
    });
  } catch (error) {
    console.error('获取用户错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户过程中发生错误',
    });
  }
};

/**
 * 创建用户
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, email, phone, roleIds } = req.body;

    // 检查用户名或邮箱是否已存在
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已被使用',
      });
    }

    // 获取指定的角色
    let roles: Role[] = [];
    if (roleIds && roleIds.length > 0) {
      roles = await roleRepository.findByIds(roleIds);
    } else {
      // 获取默认角色（普通用户）
      const userRole = await roleRepository.findOne({
        where: { name: 'user' },
      });
      if (userRole) {
        roles = [userRole];
      }
    }

    // 创建新用户
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.phone = phone || '';
    user.roles = roles;

    await userRepository.save(user);

    // 记录操作日志
    const actionLog = new ActionLog();
    actionLog.action = 'CREATE';
    actionLog.module = 'USER';
    actionLog.description = `创建用户: ${username}`;
    actionLog.ip = req.ip || '';
    actionLog.userAgent = req.headers['user-agent'] || '';
    actionLog.user = req.user!;  // 使用非空断言，因为已经经过了认证中间件
    await actionLogRepository.save(actionLog);

    return res.status(201).json({
      success: true,
      message: '创建用户成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    return res.status(500).json({
      success: false,
      message: '创建用户过程中发生错误',
    });
  }
};

/**
 * 更新用户
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { email, phone, isActive, roleIds } = req.body;

    // 查找用户
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 更新用户信息
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    // 更新角色
    if (roleIds && roleIds.length > 0) {
      const roles = await roleRepository.findByIds(roleIds);
      user.roles = roles;
    }

    await userRepository.save(user);

    // 记录操作日志
    const actionLog = new ActionLog();
    actionLog.action = 'UPDATE';
    actionLog.module = 'USER';
    actionLog.description = `更新用户: ${user.username}`;
    actionLog.ip = req.ip || '';
    actionLog.userAgent = req.headers['user-agent'] || '';
    actionLog.user = req.user!;  // 使用非空断言，因为已经经过了认证中间件
    await actionLogRepository.save(actionLog);

    return res.status(200).json({
      success: true,
      message: '更新用户成功',
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    return res.status(500).json({
      success: false,
      message: '更新用户过程中发生错误',
    });
  }
};

/**
 * 删除用户
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // 查找用户
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 记录要删除的用户名，用于日志
    const username = user.username;

    // 删除用户
    await userRepository.remove(user);

    // 记录操作日志
    const actionLog = new ActionLog();
    actionLog.action = 'DELETE';
    actionLog.module = 'USER';
    actionLog.description = `删除用户: ${username}`;
    actionLog.ip = req.ip || '';
    actionLog.userAgent = req.headers['user-agent'] || '';
    actionLog.user = req.user!;  // 使用非空断言，因为已经经过了认证中间件
    await actionLogRepository.save(actionLog);

    return res.status(200).json({
      success: true,
      message: '删除用户成功',
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    return res.status(500).json({
      success: false,
      message: '删除用户过程中发生错误',
    });
  }
}; 