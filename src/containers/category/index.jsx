import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';
import { connect } from 'react-redux';

import CategoryForm from './category-form';
import {
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync
} from '$redux/actions';

let categoryFormInstance = null;

function Category({
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,
  categories
}) {
  /*
    能让纯函数组件使用状态
    const [ 状态数据, 更新状态数据的方法 ] = useState(状态数据的初始化值)
  */
  const [isShowCategoryModal, setIsShowCategoryModal] = useState(false);
  const [category, setCategory] = useState({});

  /*
      能让纯函数组件使用生命周期函数
      useEffect(() => {
        // 相当于 componentDidMount  / componentDidUpdate
        return () => {
          // 相当于 componentWillUnmount
        }
      }, [])
    */
  useEffect(() => {
    // 相当于 componentDidMount  / componentDidUpdate
    getCategoryListAsync();
  }, [getCategoryListAsync]);

  /*
  缓存函数
  useCallback
 */
  const delCategory = useCallback(
    category => {
      return () => {
        Modal.confirm({
          title: `您确认要删除${category.name}分类吗?`,
          onOk: () => {
            deleteCategoryAsync(category._id)
              .then(() => {
                message.success('删除分类成功~');
              })
              .catch(err => {
                message.error(err);
              });
          }
        });
      };
    },
    [deleteCategoryAsync]
  );

  /**
   * 隐藏添加分类对话框
   */
  const hiddenCategoryModal = useCallback(() => {
    // 更新状态数据
    setIsShowCategoryModal(false);
  }, [setIsShowCategoryModal]);
  /**
   * 显示添加分类对话框
   */
  const showCategoryModal = useCallback(
    (category = {}) => {
      return () => {
        setIsShowCategoryModal(true);
        setCategory(category);
      };
    },
    [setIsShowCategoryModal, setCategory]
  );

  /*
    缓存计算结果 / 值（一上来就会调用一次，缓存调用的后的返回值）
    useMemo
  */
  const columns = useMemo(() => {
    return [
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
              <Button type='link' onClick={showCategoryModal(category)}>
                修改分类
              </Button>
              <Button type='link' onClick={delCategory(category)}>
                删除分类
              </Button>
            </div>
          );
        }
      }
    ];
  }, [showCategoryModal, delCategory]);

  const addOrUpdateCategory = useCallback(() => {
    /*
      1. 校验表单
      2. 收集数据
        validateFields
      3. 发送请求，更新后端数据
      4. 请求成功，更新前端数据
    */
    const { validateFields, resetFields } = categoryFormInstance.props.form;
    const { name, _id } = category;

    validateFields((err, values) => {
      if (!err) {
        const { categoryName } = values;
        // 3. 发送请求，更新后端数据
        // 添加 / 修改 --> category.name

        let promise = null;

        if (name) {
          // 修改
          promise = updateCategoryAsync(_id, categoryName);
        } else {
          // 添加
          promise = addCategoryAsync(categoryName);
        }

        promise
          .then(() => {
            // 提示添加成功~
            message.success(`${name ? '修改' : '添加'}分类成功~`);
            // 清空表单数据
            resetFields();
            // 隐藏对话框
            hiddenCategoryModal();
          })
          .catch(err => {
            message.error(err);
          });
      }
    });
  }, [updateCategoryAsync, addCategoryAsync, hiddenCategoryModal, category]);

  return (
    <Card
      title='分类列表'
      extra={
        <Button type='primary' onClick={showCategoryModal()}>
          <Icon type='plus' />
          分类列表
        </Button>
      }
    >
      <Table
        columns={columns}
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
        onOk={addOrUpdateCategory}
        onCancel={hiddenCategoryModal}
        width={300}
      >
        <CategoryForm
          categoryName={category.name}
          wrappedComponentRef={form => {
            categoryFormInstance = form;
          }}
        />
      </Modal>
    </Card>
  );
}

export default connect(state => ({ categories: state.categories }), {
  getCategoryListAsync,
  addCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync
})(Category);
