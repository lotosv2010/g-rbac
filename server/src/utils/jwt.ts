import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JwtPayload } from '../types';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1d';

/**
 * 生成JWT令牌
 * @param user 用户对象
 * @returns JWT令牌
 */
export const generateToken = (user: User): string => {
  const payload: any = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  return (jwt.sign as any)(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * 验证JWT令牌
 * @param token JWT令牌
 * @returns 解码后的载荷或null
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}; 