import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import RoleManagement from '../pages/RoleManagement';
import PermissionManagement from '../pages/PermissionManagement';
import NotFound from '../pages/NotFound';
import RoleRoute from '../components/RoleRoute';

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
        element: <RoleRoute role={["admin", "user"]}><Dashboard /></RoleRoute>,
      },
      {
        path: 'management',
        children: [
          {
            path: 'users',
            element: (
              <RoleRoute role={["admin"]}>
                <UserManagement />
              </RoleRoute>
            ),
          },
          {
            path: 'roles',
            element: (
              <RoleRoute role={["admin"]}>
                <RoleManagement />
              </RoleRoute>
            ),
          },
          {
            path: 'permissions',
            element: (
              <RoleRoute role={["admin"]}>
                <PermissionManagement />
              </RoleRoute>
            ),
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