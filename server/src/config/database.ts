import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();
// 数据库连接配置
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: 'root',
  password: 'root123456',
  database: 'rbac_system',
  synchronize: process.env.NODE_ENV === 'development', // 开发环境下自动同步数据库结构
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../models/**/*.{js,ts}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{js,ts}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{js,ts}')],
});

// 初始化数据库连接函数
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}; 