import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// 公共路由
router.post('/register', AuthController.register as any);
router.post('/login', AuthController.login as any);

// 需要认证的路由
router.get('/current', authenticate as any, AuthController.getCurrentUser as any);

export default router; 