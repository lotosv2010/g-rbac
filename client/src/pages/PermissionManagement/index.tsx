import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { permission } from '../../services';
import PermissionForm from './PermissionForm';
import styles from './index.module.less';
import { IPermission, IPermissionsParam } from '../../types/permission';

/**
 * 权限管理页面组件
 */
const PermissionManagement: React.FC = () => {
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 获取权限列表
  const fetchPermissions = async (params?: IPermissionsParam) => {
    try {
      setLoading(true);
      const response = await permission.getPermissions({page, limit, ...params});
      if (response.success) {
        const { permissions, pagination } = response.data!;
        setPermissions(permissions);
        setTotal(pagination.total);
      }
    } catch (error) {
      message.error('获取权限列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // 处理搜索
  const handleSearch = (values: IPermissionsParam) => {
    fetchPermissions(values);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    fetchPermissions();
  };

  // 处理创建权限
  const handleCreate = () => {
    setCurrentPermission(null);
    setVisible(true);
  };

  // 处理编辑权限
  const handleEdit = (permission: any) => {
    setCurrentPermission(permission);
    setVisible(true);
  };

  // 处理删除权限
  const handleDelete = async (id: number) => {
    try {
      const response = await permission.deletePermission(id);
      if (response.success) {
        message.success('删除权限成功');
        fetchPermissions();
      }
    } catch (error) {
      message.error('删除权限失败');
      console.log(error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (currentPermission) {
        const response = await permission.updatePermission(currentPermission.id, values);
        if (response.success) {
          message.success('更新权限成功');
          setVisible(false);
          fetchPermissions();
        }
      } else {
        const response = await permission.createPermission(values);
        if (response.success) {
          message.success('创建权限成功');
          setVisible(false);
          fetchPermissions();
        }
      }
    } catch (error) {
      message.error(currentPermission ? '更新权限失败' : '创建权限失败');
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          className={styles.searchForm}
        >
          <Form.Item name="name">
            <Input placeholder="权限名称" allowClear />
          </Form.Item>
          <Form.Item name="code">
            <Input placeholder="权限编码" allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建权限
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="id"
        loading={loading}
        scroll={{
          y: document.body.clientHeight - 340,
        }}
        pagination={{
          pageSize: 10,
          total: total,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
            const values = searchForm.getFieldsValue();
            fetchPermissions({
              page: page,
              limit: pageSize,
              ...values
            })
            
          },
        }}
      />
      <Modal
        title={currentPermission ? '编辑权限' : '新建权限'}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <PermissionForm
          form={form}
          initialValues={currentPermission}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default PermissionManagement; 