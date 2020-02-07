import React, { Component } from 'react';
import { Card, Icon, Descriptions } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCategoryListAsync } from '$redux/actions';
import { reqGetProduct } from '$api';
import './index.less';

@connect(state => ({ categories: state.categories }), { getCategoryListAsync })
class ProductDetail extends Component {
  state = {
    product: {}
  };

  componentDidMount() {
    if (!this.props.categories.length) {
      this.props.getCategoryListAsync();
    }
    if (!this.props.location.state) {
      reqGetProduct(this.props.match.params.id).then(res => {
        this.setState({
          product: res
        });
      });
    }
  }

  render() {
    const {
      location: { state },
      categories
    } = this.props;

    const { name, desc, price, categoryId, status, detail } =
      state || this.state.product;

    const category = categories.find(category => category._id === categoryId);

    const categoryName = category ? category.name : '暂无分类';

    return (
      <Card
        title={
          <div>
            <Link to='/product'>
              <Icon type='arrow-left' className='go-back' />
            </Link>
            商品详情
          </div>
        }
      >
        <Descriptions bordered>
          <Descriptions.Item label='商品名称'>{name}</Descriptions.Item>
          <Descriptions.Item label='商品描述'>{desc}</Descriptions.Item>
          <Descriptions.Item label='商品价格'>￥{price}</Descriptions.Item>
          <Descriptions.Item label='商品分类'>{categoryName}</Descriptions.Item>
          <Descriptions.Item label='商品状态' span={2}>
            {status === 1 ? '下架' : '上架'}
          </Descriptions.Item>
          <Descriptions.Item label='商品详情'>
            {/* 
              默认情况下，React会对所有输出转义处理。
              使用dangerouslySetInnerHTML属性，可以让其不被转义。但是要注意这样做很危险。
              所有一般情况下是没有这样的需求，或者要判断是否出现了script/link等标签，需要去除
            */}
            <div dangerouslySetInnerHTML={{ __html: detail }}></div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}
export default ProductDetail;
