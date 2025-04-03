import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { permission, role } from '../../services';
import RoleForm from './RoleForm';
import styles from './index.module.less';
import { IRole, IRolesParam } from '../../types/role';
import { IPermission } from '../../types/permission';

/**
 * 角色管理页面组件
 */
const RoleManagement: React.FC = () => {
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 获取角色列表
  const fetchRoles = async (params?: IRolesParam) => {
    try {
      setLoading(true);
      const response = await role.getRoles({ limit, page, ...params });
      if (response.success) {
        const { roles, pagination } = response.data!;
        setRoles(roles);
        setTotal(pagination.total);
      }
    } catch (error) {
      message.error('获取角色列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      const response = await permission.getPermissions({limit: 1000, page: 1});
      if (response.success) {
        const { permissions} = response.data!;
        setPermissions(permissions);
      }
    } catch (error) {
      message.error('获取权限列表失败');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // 处理搜索
  const handleSearch = (values: IRolesParam) => {
    fetchRoles(values);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    fetchRoles();
  };

  // 处理创建角色
  const handleCreate = () => {
    setCurrentRole(null);
    setVisible(true);
  };

  // 处理编辑角色
  const handleEdit = (role: any) => {
    setCurrentRole(role);
    setVisible(true);
  };

  // 处理删除角色
  const handleDelete = async (id: number) => {
    try {
      const response = await role.deleteRole(id);
      if (response.success) {
        message.success('删除角色成功');
        fetchRoles();
      }
    } catch (error) {
      message.error('删除角色失败');
      console.log(error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (currentRole) {
        const response = await role.updateRole(currentRole.id, values);
        if (response.success) {
          message.success('更新角色成功');
          setVisible(false);
          fetchRoles();
        }
      } else {
        const response = await role.createRole(values);
        if (response.success) {
          message.success('创建角色成功');
          setVisible(false);
          fetchRoles();
        }
      }
    } catch (error) {
      message.error(currentRole ? '更新角色失败' : '创建角色失败');
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: Array<{ name: string }>) =>
        permissions.map(p => p.name).join('、'),
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
            <Input placeholder="角色名称" allowClear />
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
          新建角色
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={roles}
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
            fetchRoles({
              page: page,
              limit: pageSize,
              ...values
            })
          },
        }}
      />
      <Modal
        title={currentRole ? '编辑角色' : '新建角色'}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <RoleForm
          form={form}
          initialValues={currentRole}
          onSubmit={handleSubmit}
          permissions={permissions}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement; 