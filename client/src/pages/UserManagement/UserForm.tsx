import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { IUser } from '../../types/user';

const { Option } = Select;

/**
 * 用户表单组件属性
 */
interface UserFormProps {
  form: any;
  initialValues?: Partial<IUser | null>;
  onSubmit: (values: IUser) => void;
  roles: Array<{ id: number; name: string }>;
}

/**
 * 用户表单组件
 */
const UserForm: React.FC<UserFormProps> = ({
  form,
  initialValues,
  onSubmit,
  roles,
}) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        roleIds: initialValues.roles?.map((role: any) => role.id),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>
      {!initialValues && <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: !initialValues, message: '请输入密码' },
          { min: 6, message: '密码长度不能小于6位' },
        ]}
      >
        <Input.Password />
      </Form.Item>}
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="状态"
        initialValue={true}
      >
        <Select>
          <Option value={true}>启用</Option>
          <Option value={false}>禁用</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="roleIds"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select mode="multiple" placeholder="请选择角色">
          {roles.map(role => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm; 