import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/rbac.middleware';

const router = Router();

// 所有用户路由都需要认证
router.use(authenticate as any);

// 用户管理路由
router.get('/', hasPermission('user:list') as any, getAllUsers as any);
router.get('/:id', hasPermission('user:read') as any, getUserById as any);
router.post('/', hasPermission('user:create') as any, createUser as any);
router.put('/:id', hasPermission('user:update') as any, updateUser as any);
router.delete('/:id', hasPermission('user:delete') as any, deleteUser as any);

export default router; 