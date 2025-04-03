# RBAC 权限管理系统 - 服务端

这是一个基于 Node.js + Express + TypeScript + Prisma 的 RBAC（基于角色的访问控制）权限管理系统的服务端实现。

## 项目架构

项目采用分层架构设计，主要包含以下层次：

- **Controller层**：处理HTTP请求，调用Service层处理业务逻辑
- **Service层**：实现核心业务逻辑
- **Model层**：定义数据模型和数据库操作
- **Middleware层**：实现中间件功能，如权限验证
- **Route层**：定义API路由
- **Utils层**：提供工具函数
- **Config层**：配置文件管理
- **Types层**：TypeScript类型定义

## 目录结构

```
server/
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── middleware/     # 中间件
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   ├── services/       # 服务
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   └── index.ts        # 入口文件
├── .env                # 环境变量
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
└── README.md           # 项目说明
```

## 主要功能

1. **用户管理**
   - 用户CRUD操作
   - 用户角色分配

2. **角色管理**
   - 角色CRUD操作
   - 角色权限分配

3. **权限管理**
   - 权限CRUD操作
   - 权限代码管理

4. **权限验证**
   - 基于角色的权限验证
   - 基于权限代码的权限验证

## 技术栈

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT (用于认证)

## 环境要求

- Node.js >= 16
- PostgreSQL >= 12
- pnpm >= 7

## 安装和运行

1. 安装依赖：
```bash
pnpm install
```

2. 配置环境变量：
复制 `.env.example` 为 `.env`，并修改相关配置：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/rbac"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

3. 初始化数据库：
```bash
pnpm prisma migrate dev
```

4. 启动开发服务器：
```bash
pnpm dev
```

## API文档

### 用户相关接口

- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 角色相关接口

- `GET /api/roles` - 获取角色列表
- `GET /api/roles/:id` - 获取角色详情
- `POST /api/roles` - 创建角色
- `PUT /api/roles/:id` - 更新角色
- `DELETE /api/roles/:id` - 删除角色

### 权限相关接口

- `GET /api/permissions` - 获取权限列表
- `GET /api/permissions/:id` - 获取权限详情
- `POST /api/permissions` - 创建权限
- `PUT /api/permissions/:id` - 更新权限
- `DELETE /api/permissions/:id` - 删除权限

## 权限验证

系统提供了两个主要的权限验证中间件：

1. `hasRole(roleName: string)` - 验证用户是否具有指定角色
2. `hasPermission(permissionCode: string)` - 验证用户是否具有指定权限

使用示例：
```typescript
router.get('/admin', hasRole('admin'), adminController.getAdminPage);
router.post('/users', hasPermission('user:create'), userController.createUser);
```

## 注意事项

1. 数据库配置
   - 确保PostgreSQL服务已启动
   - 正确配置数据库连接字符串
   - 定期备份数据库

2. 安全性
   - 妥善保管JWT密钥
   - 使用HTTPS在生产环境
   - 实现请求频率限制
   - 实现输入验证和清理

3. 性能优化
   - 使用数据库索引
   - 实现缓存机制
   - 优化查询语句

4. 开发建议
   - 遵循TypeScript最佳实践
   - 编写单元测试
   - 使用ESLint进行代码检查
   - 保持代码注释完整

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 