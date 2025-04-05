import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasAnyRole } from '../utils/role';

interface RoleRouteProps {
  children: React.ReactNode;
  role: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, role }) => {
  const location = useLocation();

  if (!hasAnyRole(role)) {
    // 如果没有角色权限，重定向到首页
    return <Navigate to="/404" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute; 