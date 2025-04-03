import React, { useEffect } from 'react';
import { Form, Input, Button, Space } from 'antd';

interface PermissionFormProps {
  form: any;
  initialValues?: {
    id?: number;
    name?: string;
    code?: string;
    description?: string;
  };
  onSubmit: (values: any) => void;
}

/**
 * 权限表单组件
 */
const PermissionForm: React.FC<PermissionFormProps> = ({
  form,
  initialValues,
  onSubmit,
}) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

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
        label="权限名称"
        rules={[{ required: true, message: '请输入权限名称' }]}
      >
        <Input placeholder="请输入权限名称" />
      </Form.Item>
      <Form.Item
        name="code"
        label="权限编码"
        rules={[{ required: true, message: '请输入权限编码' }]}
      >
        <Input placeholder="请输入权限编码" />
      </Form.Item>
      <Form.Item
        name="description"
        label="描述"
      >
        <Input.TextArea placeholder="请输入描述" />
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

export default PermissionForm; 