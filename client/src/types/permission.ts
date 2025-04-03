export interface IPermission {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface IPermissionsParam {
  limit: number;
  page: number;
  name?: string;
  code?: string;
}

export interface IPermissionsResponse {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  permissions: IPermission[];
}