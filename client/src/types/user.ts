import { IRole } from './role';

export interface IUser {
  id: number;
  username: string;
  email: string;
  roles: IRole[];
}

export interface IUsersParam {
  limit: number;
  page: number;
  username?: string;
  email?: string;
}

export interface IUsersResponse {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  users: IUser[];
}