import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import { user, role, permission } from '../../services';
import styles from './index.module.less';

/**
 * 仪表盘页面组件
 */
const Dashboard: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [permissionCount, setPermissionCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
          user.getUsers(),
          role.getRoles(),
          permission.getPermissions(),
        ]);

        if (usersResponse.success) {
          const { pagination } = usersResponse.data!;
          setUserCount(pagination?.total ?? 0);
        }
        
        if (rolesResponse.success) {
          const { pagination } = rolesResponse.data!;
          setRoleCount(pagination.total);
        }
        
        if (permissionsResponse.success) {
          const { pagination } = permissionsResponse.data!;
          setPermissionCount(pagination.total);
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="用户总数"
              value={userCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="角色总数"
              value={roleCount}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="权限总数"
              value={permissionCount}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 