import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import { UserOutlined, DashboardOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../services';
import { IUser } from '../../types/user';
import styles from './index.module.less';

const { Header, Sider, Content } = Layout;

/**
 * 主布局组件
 */
const MainLayout: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    try {
      const { data } = await auth.getCurrentUser();
      if (data?.username) {
        setUser(data);
      }
    } catch (error) {
      message.error('获取用户信息失败');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 处理菜单点击
  const handleMenuClick = (keyPath: string[]) => {
    const path = keyPath.reverse().join('/');
    navigate(path);
  };

  // 处理退出登录
  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };


  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/management',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: 'roles',
          icon: <TeamOutlined />,
          label: '角色管理',
        },
        {
          key: 'permissions',
          icon: <LockOutlined />,
          label: '权限管理',
        },
      ]
    },
  ];

  const dropdownItems = [
    { key: 'logout', label: '退出登录' }
  ]

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider}>
        <div className={styles.logo}>RBAC 系统</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ keyPath }) => handleMenuClick(keyPath)}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.userInfo}>
            <Dropdown menu={{
              items: dropdownItems,
              onClick: ({ key }) => {
                if (key === 'logout') {
                  handleLogout()
                }
              },
            }} placement="bottomRight">
              <div className={styles.user}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.username}>{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 