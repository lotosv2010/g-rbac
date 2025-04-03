import { AppDataSource } from './database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

// 权限数据
const permissionsData = [
  // 用户权限
  { name: '查看用户列表', code: 'user:list', description: '允许查看用户列表', resourceType: 'user' },
  { name: '查看用户详情', code: 'user:read', description: '允许查看用户详情', resourceType: 'user' },
  { name: '创建用户', code: 'user:create', description: '允许创建新用户', resourceType: 'user' },
  { name: '更新用户', code: 'user:update', description: '允许更新用户信息', resourceType: 'user' },
  { name: '删除用户', code: 'user:delete', description: '允许删除用户', resourceType: 'user' },
  
  // 角色权限
  { name: '查看角色列表', code: 'role:list', description: '允许查看角色列表', resourceType: 'role' },
  { name: '查看角色详情', code: 'role:read', description: '允许查看角色详情', resourceType: 'role' },
  { name: '创建角色', code: 'role:create', description: '允许创建新角色', resourceType: 'role' },
  { name: '更新角色', code: 'role:update', description: '允许更新角色信息', resourceType: 'role' },
  { name: '删除角色', code: 'role:delete', description: '允许删除角色', resourceType: 'role' },
  
  // 权限权限
  { name: '查看权限列表', code: 'permission:list', description: '允许查看权限列表', resourceType: 'permission' },
  { name: '查看权限详情', code: 'permission:read', description: '允许查看权限详情', resourceType: 'permission' },
  { name: '创建权限', code: 'permission:create', description: '允许创建新权限', resourceType: 'permission' },
  { name: '更新权限', code: 'permission:update', description: '允许更新权限信息', resourceType: 'permission' },
  { name: '删除权限', code: 'permission:delete', description: '允许删除权限', resourceType: 'permission' },
];

// 角色数据
const rolesData = [
  { name: 'admin', description: '系统管理员，拥有所有权限' },
  { name: 'user', description: '普通用户，拥有基础功能权限' },
];

// 管理员用户数据
const adminUserData = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com',
  phone: '13800138000',
};

/**
 * 初始化数据库种子数据
 */
export const seedDatabase = async () => {
  try {
    console.log('开始初始化数据库种子数据...');
    
    const permissionRepository = AppDataSource.getRepository(Permission);
    const roleRepository = AppDataSource.getRepository(Role);
    const userRepository = AppDataSource.getRepository(User);
    
    // 清空现有数据（如果需要）
    // await userRepository.clear();
    // await roleRepository.clear();
    // await permissionRepository.clear();
    
    // 1. 创建权限
    const permissions: Permission[] = [];
    for (const permissionData of permissionsData) {
      // 检查权限是否已存在
      let permission = await permissionRepository.findOne({
        where: { code: permissionData.code }
      });
      
      if (!permission) {
        permission = new Permission();
        permission.name = permissionData.name;
        permission.code = permissionData.code;
        permission.description = permissionData.description;
        permission.resourceType = permissionData.resourceType;
        await permissionRepository.save(permission);
        console.log(`创建权限: ${permission.name}`);
      }
      
      permissions.push(permission);
    }
    
    // 2. 创建角色
    const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    const userRole = await roleRepository.findOne({ where: { name: 'user' } });
    
    // 创建管理员角色
    if (!adminRole) {
      const newAdminRole = new Role();
      newAdminRole.name = 'admin';
      newAdminRole.description = '系统管理员，拥有所有权限';
      newAdminRole.permissions = permissions; // 管理员拥有所有权限
      await roleRepository.save(newAdminRole);
      console.log('创建管理员角色');
    }
    
    // 创建用户角色
    if (!userRole) {
      const newUserRole = new Role();
      newUserRole.name = 'user';
      newUserRole.description = '普通用户，拥有基础功能权限';
      // 只分配基本权限给普通用户
      newUserRole.permissions = permissions.filter(p => 
        p.code.includes(':list') || p.code.includes(':read')
      );
      await roleRepository.save(newUserRole);
      console.log('创建普通用户角色');
    }
    
    // 3. 创建管理员用户
    const adminUser = await userRepository.findOne({
      where: { username: 'admin' }
    });
    
    if (!adminUser) {
      const newAdminUser = new User();
      newAdminUser.username = adminUserData.username;
      newAdminUser.password = adminUserData.password;
      newAdminUser.email = adminUserData.email;
      newAdminUser.phone = adminUserData.phone;
      
      // 分配管理员角色
      const adminRole = await roleRepository.findOne({
        where: { name: 'admin' },
        relations: ['permissions']
      });
      
      if (adminRole) {
        newAdminUser.roles = [adminRole];
        await userRepository.save(newAdminUser);
        console.log('创建管理员用户');
      }
    }
    
    console.log('数据库种子数据初始化完成!');
  } catch (error) {
    console.error('数据库种子数据初始化失败:', error);
  }
}; 