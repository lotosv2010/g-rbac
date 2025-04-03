import { Router } from 'express';
import {RoleController} from '../controllers/role.controller';
import { authenticate } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/rbac.middleware';

const router = Router();

// 所有角色路由都需要认证
router.use(authenticate as any);

// 角色管理路由
router.get('/', hasPermission('role:list') as any, RoleController.getRoles as any);
router.get('/:id', hasPermission('role:read') as any, RoleController.getRole as any);
router.post('/', hasPermission('role:create') as any, RoleController.createRole as any);
router.put('/:id', hasPermission('role:update') as any, RoleController.updateRole as any);
router.delete('/:id', hasPermission('role:delete') as any, RoleController.deleteRole as any);

export default router; 