import { IPermission } from "./permission";

export interface IRole {
  id: number;
  name: string;
  description: string;
  permissions: IPermission[];
}

export interface IRolesParam {
  limit: number;
  page: number;
  name?: string;
}

export interface IRolesResponse {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  roles: IRole[];
}