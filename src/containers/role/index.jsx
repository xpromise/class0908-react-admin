import React, { Component } from 'react';
import { Card, Button, Radio, Table, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { getRoleListAsync, addRoleAsync } from '$redux/actions';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';

const { Group } = Radio;

@connect(state => ({ roles: state.roles }), {
  getRoleListAsync,
  addRoleAsync
})
class Role extends Component {
  state = {
    isLoading: false,
    isShowAddRoleModal: false, // 是否显示添加角色Modal
    isShowUpdateRoleModal: false,
    role: {} // 选中的角色数据
  };

  // 缓存数据
  columns = [
    {
      // 注意：如果不写dataIndex就会报错。
      dataIndex: '_id',
      render: id => {
        return <Radio key={id} value={id} />;
      }
    },
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: time => dayjs(time).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      title: '授权时间',
      dataIndex: 'authTime',
      render: time => {
        // 如果没有授权，time为undefined，不应该显示授权时间
        return time && dayjs(time).format('YYYY/MM/DD HH:mm:ss');
      }
    },
    {
      title: '授权人',
      dataIndex: 'authName'
    }
  ];

  // 发送请求，获取角色数据
  componentDidMount() {
    this.setState({
      isLoading: true
    });
    this.props
      .getRoleListAsync()
      .then(() => {
        message.success('获取角色列表数据成功');
      })
      .catch(err => {
        message.error(err);
      })
      .finally(() => {
        this.setState({
          isLoading: false
        });
      });
  }

  // 显示添加角色Modal
  /* showAddRoleModal = () => {
    this.setState({
      isShowAddRoleModal: true
    })
  }

  hiddenAddRoleModal = () => {
    this.setState({
      isShowAddRoleModal: false
    })
  } */
  // 复用函数，封装成高阶函数
  /*
    key 代表要更新的state的属性名 isShowAddRoleModal / isShowUpdateRoleModal
    value 代表要更新的state的属性值 true / false
  */
  switchModal = (key, value) => {
    return () => {
      // 判断是否是隐藏对话框 --> false就是隐藏对话框
      if (!value) {
        // 判断清空的是 创建角色 还是 设置角色权限
        if (key === 'isShowAddRoleModal') {
          this.addRoleForm.props.form.resetFields();
        } else {
          // 清空 设置角色权限 表单数据
        }
      }
      this.setState({
        [key]: value
      });
    };
  };

  // 添加角色
  addRole = () => {
    // 校验表单并收集数据
    // console.log(this.addRoleForm);
    const { validateFields, resetFields } = this.addRoleForm.props.form;
    validateFields((err, values) => {
      if (!err) {
        // 表单校验成功
        const { name } = values;
        // 发送请求，创建角色
        this.props
          .addRoleAsync(name)
          .then(() => {
            message.success('创建角色成功~');
            // 隐藏对话框
            this.setState({
              isShowAddRoleModal: false
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

  // 处理单选按钮事件
  handleRadioChange = e => {
    // 单选按钮选中的值需要什么？ 看功能需要所有数据
    // 但是这里这能得到id，否则会报错
    const id = e.target.value;
    // 查找到角色数据
    const role = this.props.roles.find(role => role._id === id);
    // 更新成状态
    this.setState({
      role
    });
  };

  // 设置角色权限
  updateRole = () => {
    // 获取表单的实例对象
    const { validateFields } = this.updateRoleForm.props.form;
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    })
  };

  render() {
    const {
      isLoading,
      isShowAddRoleModal,
      isShowUpdateRoleModal,
      role
    } = this.state;

    const { roles } = this.props;

    return (
      <Card
        title={
          <div>
            <Button
              type='primary'
              onClick={this.switchModal('isShowAddRoleModal', true)}
            >
              创建角色
            </Button>
            &nbsp;&nbsp;
            <Button
              type='primary'
              disabled={!role._id}
              onClick={this.switchModal('isShowUpdateRoleModal', true)}
            >
              设置角色权限
            </Button>
          </div>
        }
      >
        {/* 
          Group 包裹 Table。因为 Table 有 Radio 
          这样就能让 Radio 变成单选
        */}
        <Group style={{ width: '100%' }} onChange={this.handleRadioChange}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            loading={isLoading}
          />
        </Group>

        <Modal
          title='创建角色'
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchModal('isShowAddRoleModal', false)}
        >
          <AddRoleForm
            wrappedComponentRef={form => (this.addRoleForm = form)}
          />
        </Modal>

        <Modal
          title='设置角色权限'
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.switchModal('isShowUpdateRoleModal', false)}
        >
          <UpdateRoleForm
            wrappedComponentRef={form => (this.updateRoleForm = form)}
            role={role}
          />
        </Modal>
      </Card>
    );
  }
}

export default Role;
