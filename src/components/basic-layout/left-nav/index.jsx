import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

const { SubMenu, Item } = Menu;

export default class LeftNav extends Component {
  render() {
    return (
      <Menu
        theme='dark' // 主题色
        defaultSelectedKeys={['9']} // 默认选中的菜单
        mode='inline'
      >
        <Item key='1'>
          <Icon type='home' />
          <span>首页</span>
        </Item>
        <SubMenu
          key='sub1'
          title={
            <span>
              <Icon type='appstore' />
              <span>商品</span>
            </span>
          }
        >
          <Item key='3'>
            <Icon type='bars' />
            <span>分类管理</span>
          </Item>
          <Item key='4'>
            <Icon type='tool' />
            <span>商品管理</span>
          </Item>
        </SubMenu>
        <SubMenu
          key='sub2'
          title={
            <span>
              <Icon type='team' />
              <span>Team</span>
            </span>
          }
        >
          <Item key='6'>Team 1</Item>
          <Item key='8'>Team 2</Item>
        </SubMenu>
        <Item key='9'>
          <Icon type='file' />
          <span>File</span>
        </Item>
      </Menu>
    );
  }
}
