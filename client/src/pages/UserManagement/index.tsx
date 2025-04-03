import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { user, role } from '../../services';
import UserForm from './UserForm';
import styles from './index.module.less';
import { IUsersParam, IUser } from '../../types/user';
import { IRole } from '../../types/role';

/**
 * 用户管理页面组件
 */
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [roles, setRoles] = useState<Array<IRole>>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<IUser | null>>();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async (params?: IUsersParam) => {
    try {
      setLoading(true);
      const { data, success } = await user.getUsers({ limit, page, ...params });
      if (success) {
        const { pagination, users } = data!;
        setUsers(users);
        setTotal(pagination.total)
      }
    } catch (error) {
      message.error('获取用户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const { data, success } = await role.getRoles({page: 1, limit: 1000});
      if (success) {
        const { roles } = data!;
        setRoles(roles);
      }
    } catch (error) {
      message.error('获取角色列表失败');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // 处理搜索
  const handleSearch = (values: IUsersParam) => {
    fetchUsers(values);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    fetchUsers();
  };

  // 处理创建用户
  const handleCreate = () => {
    setCurrentUser(null);
    setVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setVisible(true);
  };

  // 处理删除用户
  const handleDelete = async (id: number) => {
    try {
      const response = await user.deleteUser(id);
      if (response.success) {
        message.success('删除用户成功');
        fetchUsers();
      }
    } catch (error) {
      message.error('删除用户失败');
      console.log(error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: IUser) => {
    try {
      if (currentUser) {
        const response = await user.updateUser(currentUser.id!, values);
        if (response.success) {
          message.success('更新用户成功');
          setVisible(false);
          fetchUsers();
        }
      } else {
        const response = await user.createUser(values);
        if (response.success) {
          message.success('创建用户成功');
          setVisible(false);
          fetchUsers();
        }
      }
    } catch (error) {
      message.error(currentUser ? '更新用户失败' : '创建用户失败');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      key: 'roles',
      render: (_: any, record: any) => (
        <span>
          {record.roles.map((r: any) => r.name).join(', ')}
        </span>
      ),
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
          <Form.Item name="username">
            <Input placeholder="用户名" allowClear />
          </Form.Item>
          <Form.Item name="email">
            <Input placeholder="邮箱" allowClear />
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
          新建用户
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
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
            fetchUsers({
              page: page,
              limit: pageSize,
              ...values
            })
          },
        }}
      />
      <Modal
        title={currentUser ? '编辑用户' : '新建用户'}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <UserForm
          form={form}
          initialValues={currentUser}
          onSubmit={handleSubmit}
          roles={roles}
        />
      </Modal>
    </div>
  );
};

export default UserManagement; 