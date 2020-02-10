import React, { Component } from 'react';
import { Form, Input, Tree } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

@Form.create()
class UpdateRoleForm extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired
  };
  // 将 treeData 数据 转换组件，最后进行遍历展示
  renderTreeNodes = menus => {
    return menus.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={<FormattedMessage id={item.title} />}
            key={item.path}
            // 过去版本遗留的属性，可以不用设置
            // dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<FormattedMessage id={item.title} />}
          key={item.path}
        />
      );
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      role
    } = this.props;

    return (
      <Form>
        <Item label='角色名称'>
          {getFieldDecorator('name', {
            initialValue: role.name
          })(<Input disabled />)}
        </Item>
        <Item>
          {/* 
            表单受控默认是通过onChange事件收集数据
            并收集的是组件的value
            问题：Tree组件变化并不会触发onChange事件，同时组件的值也不是value属性
              Tree组件变化时触发的是 onCheck事件，组件的值是checkedKeys属性
            解决：让Form组件接管Tree组件的  onCheck事件 和 checkedKeys属性

            注意：子节点如果只选中一个或者没有，父节点是不会选中的
                  只有所有子节点被选中了，才会添加父节点
          */}
          {getFieldDecorator('menus', {
            trigger: 'onCheck', // 默认值onChange
            valuePropName: 'checkedKeys', // 默认值value
            initialValue: role.menus
          })(
            <Tree checkable={true} defaultExpandAll>
              <TreeNode title='平台权限' key='0'>
                {this.renderTreeNodes(menus)}
              </TreeNode>
            </Tree>
          )}
        </Item>
      </Form>
    );
  }
}

export default UpdateRoleForm;
