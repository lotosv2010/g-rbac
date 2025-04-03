import { IUser } from './user';
/**
 * 登录请求参数
 */
export interface ILoginParams {
  username: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface ILoginResponse {
  token: string;
  user: IUser;
}


