import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import RoleManagement from '../pages/RoleManagement';
import PermissionManagement from '../pages/PermissionManagement';
import NotFound from '../pages/NotFound';

/**
 * 路由配置
 * 定义应用程序的所有路由
 */
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'management',
        children: [
          {
            path: 'users',
            element: <UserManagement />,
          },
          {
            path: 'roles',
            element: <RoleManagement />,
          },
          {
            path: 'permissions',
            element: <PermissionManagement />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router; 