import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import { connect } from 'react-redux';

import AddCategoryForm from './add-category-form';
import {
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync
} from '$redux/actions';

@connect(state => ({ categories: state.categories }), {
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync
})
class Category extends Component {
  state = {
    isShowCategoryModal: false,
    // isUpdateCategory: false,
    category: {}
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
      // dataIndex: 'name',
      render: category => {
        /*
            render方法参数的值看 dataIndex
            如果 dataIndex 没有，得到就是整个数据
        */
        // console.log(category);

        return (
          <div>
            <Button type='link' onClick={this.showCategoryModal(category)}>
              修改分类
            </Button>
            <Button type='link'>删除分类</Button>
          </div>
        );
      }
    }
  ];

  /**
   * 添加/修改分类
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
    const {
      category: { name, _id }
    } = this.state;

    validateFields((err, values) => {
      if (!err) {
        const { categoryName } = values;
        // 3. 发送请求，更新后端数据
        // 添加 / 修改 --> category.name

        let promise = null;

        if (name) {
          // 修改
          promise = this.props.updateCategoryAsync(_id, categoryName);
        } else {
          // 添加
          promise = this.props.addCategoryAsync(categoryName);
        }

        promise
          .then(() => {
            // 提示添加成功~
            message.success(`${name ? '修改' : '添加'}分类成功~`);
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
      isShowCategoryModal: false
    });
  };
  /**
   * 显示添加分类对话框
   */
  showCategoryModal = (category = {}) => {
    return () => {
      this.setState({
        isShowCategoryModal: true,
        category
        // isUpdateCategory: category.name
      });
    };
  };

  /* showAddCategoryModal = () => {
    return () => {
      this.setState({
        isUpdateCategory: false,
        category: {}
      });
      this.showCategoryModal();
    };
  };

  // 高阶函数
  showUpdateCategoryModal = category => {
    return () => {
      this.setState({
        isUpdateCategory: true,
        category
      });
      this.showCategoryModal();
    };
  }; */

  render() {
    const { categories } = this.props;
    const { isShowCategoryModal, category } = this.state;

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
          <Button type='primary' onClick={this.showCategoryModal()}>
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
          title={category.name ? '修改分类' : '添加分类'}
          visible={isShowCategoryModal}
          onOk={this.addCategory}
          onCancel={this.hiddenAddCategory}
          width={300}
        >
          <AddCategoryForm
            categoryName={category.name}
            wrappedComponentRef={form => (this.addCategoryForm = form)}
          />
        </Modal>
      </Card>
    );
  }
}

export default Category;
