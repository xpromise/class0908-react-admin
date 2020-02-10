import React, { Component } from 'react';
import { Card, Button, Table, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'react-redux';

import { reqGetUser, reqAddUser } from '$api';
import { getRoleListAsync } from '$cont/role/store';
import UserForm from './user-form';

@connect(state => ({ roles: state.roles }), { getRoleListAsync })
class User extends Component {
  state = {
    isLoading: false,
    users: [],
    isShowUserModal: false
  };

  // 缓存数据
  columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '手机号',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: time => dayjs(time).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'roleId',
      render: roleId => {
        const role = this.props.roles.find(role => role._id === roleId);
        return role && role.name;
      }
    },
    {
      title: '操作',
      // dataIndex: 'roleId',
      render: () => {
        return (
          <div>
            <Button type='link'>修改</Button>
            <Button type='link'>删除</Button>
          </div>
        );
      }
    }
  ];

  // 发送请求，获取用户数据
  componentDidMount() {
    this.setState({
      isLoading: true
    });

    reqGetUser()
      .then(res => {
        this.setState({
          users: res
        });
        message.success('获取用户列表数据成功');
      })
      .catch(err => {
        message.error(err);
      })
      .finally(() => {
        this.setState({
          isLoading: false
        });
      });

    if (!this.props.roles.length) {
      this.props
        .getRoleListAsync()
        .then(() => {
          message.success('获取角色列表数据成功~');
        })
        .catch(err => {
          message.error(err);
        });
    }
  }

  switchModal = isShowUserModal => {
    return () => {
      this.setState({
        isShowUserModal
      });
    };
  };

  // 创建用户
  addUser = () => {
    const { validateFields, resetFields } = this.userForm.props.form;

    validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        reqAddUser(values)
          .then(res => {
            message.success('创建用户成功');
            this.setState({
              // 将数据添加到state中进行展示
              users: [...this.state.users, res],
              // 隐藏对话框
              isShowUserModal: false
            });
            // 清空表单数据
            resetFields();
          })
          .catch(err => {
            message.error(err);
          });
      }
    });
  };

  render() {
    const { isLoading, users, isShowUserModal } = this.state;
    const { roles } = this.props;

    return (
      <Card
        title={
          <Button type='primary' onClick={this.switchModal(true)}>
            添加用户
          </Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          loading={isLoading}
        />

        <Modal
          title='创建用户'
          visible={isShowUserModal}
          onOk={this.addUser}
          onCancel={this.switchModal(false)}
        >
          <UserForm
            roles={roles}
            wrappedComponentRef={form => (this.userForm = form)}
          />
        </Modal>
      </Card>
    );
  }
}

export default User;
