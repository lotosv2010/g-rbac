import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './config/database';
import { seedDatabase } from './config/seed';
import router from './routes';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 5500;

// 初始化数据库连接
initializeDatabase()
  .then(async () => {
    // 初始化种子数据
    await seedDatabase();
    
    // 中间件
    app.use(helmet()); // Helmet安全Headers
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev')); // 日志

    // 路由
    app.use('/api', router);

    // 404处理
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: '资源不存在',
      });
    });

    // 错误处理
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('服务器错误:', err);
      res.status(500).json({
        success: false,
        message: '服务器内部错误',
      });
    });

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://127.0.0.1:${PORT}`);
    });
  })
  .catch(error => {
    console.error('初始化数据库失败:', error);
    process.exit(1);
  }); 