import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { LoginRequest, RegisterRequest, AuthRequest } from '../types';
import { generateToken } from '../utils/jwt';
import { ActionLog } from '../models/ActionLog';
import bcrypt from 'bcryptjs';

// 仓库
const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const actionLogRepository = AppDataSource.getRepository(ActionLog);

/**
 * 认证控制器
 * 处理用户认证相关的HTTP请求
 */
export class AuthController {
  /**
   * 用户注册
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email, phone }: RegisterRequest = req.body;

      // 检查用户名或邮箱是否已存在
      const existingUser = await userRepository.findOne({
        where: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名或邮箱已被使用',
        });
      }

      // 获取默认角色（普通用户）
      const userRole = await roleRepository.findOne({
        where: { name: 'user' },
      });

      if (!userRole) {
        return res.status(500).json({
          success: false,
          message: '系统错误: 默认角色不存在',
        });
      }

      // 创建新用户
      const user = new User();
      user.username = username;
      user.password = password;
      user.email = email;
      user.phone = phone || '';  // 使用空字符串替代undefined
      user.roles = [userRole];

      await userRepository.save(user);

      // 记录操作日志
      const actionLog = new ActionLog();
      actionLog.action = 'REGISTER';
      actionLog.module = 'AUTH';
      actionLog.description = `用户注册: ${username}`;
      actionLog.ip = req.ip || '';  // 使用空字符串替代undefined
      actionLog.userAgent = req.headers['user-agent'] || '';  // 使用空字符串替代undefined
      await actionLogRepository.save(actionLog);

      return res.status(201).json({
        success: true,
        message: '注册成功',
      });
    } catch (error) {
      console.error('注册错误:', error);
      return res.status(500).json({
        success: false,
        message: '注册过程中发生错误',
      });
    }
  }

  /**
   * 用户登录
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginRequest = req.body;
      console.log('用户登录请求:', req.body);

      // 查找用户（包括密码字段）
      const user = await userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.username = :username', { username })
        .orWhere('user.email = :email', { email: username })
        .leftJoinAndSelect('user.roles', 'roles')
        .getOne();

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误',
        });
      }

      // 验证密码
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: '账户已被禁用',
        });
      }

      // 生成令牌
      const token = generateToken(user);

      // 更新最后登录时间
      user.lastLogin = new Date();
      await userRepository.save(user);

      // 记录操作日志
      const actionLog = new ActionLog();
      actionLog.action = 'LOGIN';
      actionLog.module = 'AUTH';
      actionLog.description = `用户登录: ${username}`;
      actionLog.ip = req.ip || '';  // 使用空字符串替代undefined
      actionLog.userAgent = req.headers['user-agent'] || '';  // 使用空字符串替代undefined
      actionLog.user = user;
      await actionLogRepository.save(actionLog);

      return res.status(200).json({
        success: true,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: user.roles.map(role => ({
              id: role.id,
              name: role.name
            }))
          }
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      return res.status(500).json({
        success: false,
        message: '登录过程中发生错误',
      });
    }
  }

  /**
   * 获取当前用户信息
   * @param req Express请求对象
   * @param res Express响应对象
   */
  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '未授权',
        });
      }

      return res.status(200).json({
        success: true,
        message: '获取用户信息成功',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          roles: user.roles.map(role => ({
            id: role.id,
            name: role.name
          }))
        }
      });
    } catch (error) {
      console.error('获取用户信息错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取用户信息过程中发生错误',
      });
    }
  }
} 