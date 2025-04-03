import { Router } from 'express';
import { 
  getAllPermissions, 
  getPermissionById, 
  createPermission, 
  updatePermission, 
  deletePermission 
} from '../controllers/permission.controller';
import { authenticate } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/rbac.middleware';

const router = Router();

// 所有权限路由都需要认证
router.use(authenticate as any);

// 权限管理路由
router.get('/', hasPermission('permission:list') as any, getAllPermissions as any);
router.get('/:id', hasPermission('permission:read')as any, getPermissionById as any);
router.post('/', hasPermission('permission:create') as any, createPermission as any);
router.put('/:id', hasPermission('permission:update') as any, updatePermission as any);
router.delete('/:id', hasPermission('permission:delete') as any, deletePermission as any);

export default router; 