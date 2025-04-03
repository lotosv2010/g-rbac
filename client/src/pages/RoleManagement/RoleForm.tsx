import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { IPermission } from '../../types/permission';

const { Option } = Select;

/**
 * 角色表单组件属性
 */
interface RoleFormProps {
  form: any;
  initialValues?: any;
  onSubmit: (values: any) => void;
  permissions: IPermission[];
}

/**
 * 角色表单组件
 */
const RoleForm: React.FC<RoleFormProps> = ({
  form,
  initialValues,
  onSubmit,
  permissions,
}) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        permissionIds: initialValues.permissions?.map((p: any) => p.id),
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
        name="name"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入角色描述' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="permissionIds"
        label="权限"
        rules={[{ required: true, message: '请选择权限' }]}
      >
        <Select mode="multiple" placeholder="请选择权限">
          {permissions.map(permission => (
            <Option key={permission.id} value={permission.id}>
              {permission.name}
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

export default RoleForm; 