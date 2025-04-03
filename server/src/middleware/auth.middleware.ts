import { Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';

// 用户仓库
const userRepository = AppDataSource.getRepository(User);

/**
 * 认证中间件，验证JWT令牌
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      });
    }

    // 从请求头中获取令牌
    const token = authorization.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌格式',
      });
    }

    // 验证令牌
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: '认证令牌无效或已过期',
      });
    }

    // 查找用户
    const user = await userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: '用户已被禁用',
      });
    }

    // 将用户信息添加到请求中
    req.user = user;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误',
    });
  }
}; 