import { Request } from 'express';
import { User } from '../models/User';

// 扩展Express请求类型，添加用户信息
export interface AuthRequest extends Request {
  user?: User;
}

// JWT载荷类型
export interface JwtPayload {
  id: number;
  username: string;
  email: string;
}

// 登录请求体类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求体类型
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
} 