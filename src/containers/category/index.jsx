import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import { connect } from 'react-redux';

import AddCategoryForm from './add-category-form';
import { getCategoryListAsync, addCategoryAsync } from '$redux/actions';

@connect(state => ({ categories: state.categories }), {
  getCategoryListAsync,
  addCategoryAsync
})
class Category extends Component {
  state = {
    isShowAddCategory: false
  };

  componentDidMount() {
    this.props.getCategoryListAsync();
  }

  columns = [
    {
      title: '品类名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render() {
        return (
          <div>
            <Button type='link'>修改分类</Button>
            <Button type='link'>删除分类</Button>
          </div>
        );
      }
    }
  ];

  /**
   * 添加分类
   */
  addCategory = () => {
    /*
      1. 校验表单
      2. 收集数据
        validateFields
      3. 发送请求，更新后端数据
      4. 请求成功，更新前端数据
    */

    const { validateFields, resetFields } = this.addCategoryForm.props.form;

    validateFields((err, values) => {
      if (!err) {
        const { categoryName } = values;
        // 3. 发送请求，更新后端数据
        this.props
          .addCategoryAsync(categoryName)
          .then(() => {
            // 提示添加成功~
            message.success('添加分类成功~');
            // 清空表单数据
            resetFields();
            // 隐藏对话框
            this.hiddenAddCategory();
          })
          .catch(err => {
            message.error(err);
          });
      }
    });
  };

  /**
   * 隐藏添加分类对话框
   */
  hiddenAddCategory = () => {
    this.setState({
      isShowAddCategory: false
    });
  };
  /**
   * 显示添加分类对话框
   */
  showAddCategory = () => {
    this.setState({
      isShowAddCategory: true
    });
  };

  render() {
    const { categories } = this.props;
    const { isShowAddCategory } = this.state;

    /* const data = [
      {
        name: 'aaa',
        _id: 1
      },
      {
        categoryName: 'bbb',
        key: 2
      },
      {
        categoryName: 'aaa',
        key: 3
      },
      {
        categoryName: 'bbb',
        key: 4
      }
    ]; */

    return (
      <Card
        title='分类列表'
        extra={
          <Button type='primary' onClick={this.showAddCategory}>
            <Icon type='plus' />
            分类列表
          </Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={categories}
          bordered
          pagination={{
            defaultPageSize: 3,
            pageSizeOptions: ['3', '6', '9', '12'],
            showSizeChanger: true, // 是否显示改变 pageSize
            showQuickJumper: true // 是否显示快速跳转
          }}
          rowKey='_id'
        />

        <Modal
          title='添加分类'
          visible={isShowAddCategory}
          onOk={this.addCategory}
          onCancel={this.hiddenAddCategory}
          width={300}
        >
          <AddCategoryForm
            wrappedComponentRef={form => (this.addCategoryForm = form)}
          />
        </Modal>
      </Card>
    );
  }
}

export default Category;
