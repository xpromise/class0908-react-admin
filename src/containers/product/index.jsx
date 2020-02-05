import React, { Component } from 'react';
import { Card, Select, Input, Button, Icon, Table, message } from 'antd';

import { reqGetProductList } from '$api';

export default class Product extends Component {
  state = {
    productList: [],
    total: 0
  };

  columns = [
    {
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '商品描述',
      dataIndex: 'desc'
    },
    {
      title: '商品价格',
      dataIndex: 'price'
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      render: () => {
        return (
          <div>
            <Button type='primary'>上架</Button>
            <span>已下架</span>
          </div>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'xxx',
      render: () => {
        return (
          <div>
            <Button type='link'>详情</Button>
            <Button type='link'>修改</Button>
          </div>
        );
      }
    }
  ];

  getProductList = (pageNum, pageSize) => {
    reqGetProductList(pageNum, pageSize)
      .then(response => {
        // console.log(response);
        this.setState({
          productList: response.list,
          total: response.total
        });
        message.success('获取商品列表数据成功~');
      })
      .catch(err => {
        message.error(err);
      });
  };

  componentDidMount() {
    this.getProductList(1, 3);
  }

  // 显示添加商品组件
  showAddProduct = () => {
    // 切换地址栏变化
    this.props.history.push('/product/add');
  }

  render() {
    const { productList, total } = this.state;

    return (
      <Card
        title={
          <div>
            <Select defaultValue='1'>
              <Select.Option value='1'>根据商品名称</Select.Option>
              <Select.Option value='2'>根据商品描述</Select.Option>
            </Select>
            <Input
              placeholder='关键字'
              style={{ width: 200, margin: '0 10px' }}
            />
            <Button type='primary'>搜索</Button>
          </div>
        }
        extra={
          <Button type='primary' onClick={this.showAddProduct}>
            <Icon type='plus' />
            添加商品
          </Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={productList}
          bordered
          pagination={{
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showSizeChanger: true,
            showQuickJumper: true,
            total,
            // 页码发生变化触发的函数
            onChange: this.getProductList,
            // pageSize 变化的回调
            onShowSizeChange: this.getProductList
          }}
          rowKey='_id'
        />
      </Card>
    );
  }
}
