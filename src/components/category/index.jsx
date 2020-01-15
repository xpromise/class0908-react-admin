import React, { useEffect, useMemo } from 'react';
import { Card, Table, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { getCategoryListAsync } from '$redux/actions';

function Category({ categories, getCategoryListAsync }) {
  useEffect(() => {
    getCategoryListAsync();
  }, [getCategoryListAsync]);

  // 缓存里面的值
  const columns = useMemo(() => {
    return [
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
  }, []);

  /* const data = [
    {
      categoryName: 'aaa',
      key: 1
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
        <Button type='primary'>
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
    </Card>
  );
}

export default connect(state => ({ categories: state.categories }), {
  getCategoryListAsync
})(Category);
