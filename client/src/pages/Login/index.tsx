import React from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services';
import { setUserRoles } from '../../utils/role';
import styles from './index.module.less';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  /**
   * 处理登录表单提交
   * @param values 表单数据
   */
  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const { data } = await auth.login(values);
      const { token, user } = data || {};
      if (token) {
        localStorage.setItem('token', token);
        
        // 获取用户角色信息
        if (user?.roles) {
          setUserRoles(user.roles);
        }
        
        message.success('登录成功');
        navigate('/');
      }
    } catch (error: unknown) {
      console.error(error);
      message.error('登录失败');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <GithubOutlined className={styles.logoIcon} />
            <span className={styles.logoText}>RBAC</span>
          </div>
          <Title level={2} className={styles.title}>
            欢迎使用 RBAC 系统
          </Title>
          <Text type="secondary" className={styles.description}>
            基于角色的访问控制系统，提供完整的权限管理解决方案
          </Text>
        </div>
        <div className={styles.right}>
          <Card className={styles.loginCard}>
            <Title level={3} className={styles.loginTitle}>
              用户登录
            </Title>
            <Form
              form={form}
              onFinish={handleSubmit}
              className={styles.form}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="用户名"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="密码"
                  size="large"
                  className={styles.input}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className={styles.submitButton}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 