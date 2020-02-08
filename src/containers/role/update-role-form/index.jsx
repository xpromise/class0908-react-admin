import React, { Component } from 'react';
import { Form, Input, Tree } from 'antd';

import menus from '$conf/menus';

const { Item } = Form;
const { TreeNode } = Tree;

// 树形控件要展示的数据
//#region
/* 
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]; 
*/
//#endregion

export default class UpdateRoleForm extends Component {
  // 将 treeData 数据 转换组件，最后进行遍历展示
  renderTreeNodes = menus => {
    return menus.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.path} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.path} />;
    });
  };

  render() {
    return (
      <Form>
        <Item label='角色名称'>
          <Input disabled />
        </Item>
        <Item>
          <Tree checkable={true} defaultExpandAll={true}>
            <TreeNode title='平台权限' key='0'>
              {this.renderTreeNodes(menus)}
            </TreeNode>
          </Tree>
        </Item>
      </Form>
    );
  }
}
