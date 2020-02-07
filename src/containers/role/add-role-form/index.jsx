import React, { Component } from 'react';
import { Form, Input } from 'antd';

const { Item } = Form;

@Form.create()
class AddRoleForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form wrapperCol={{ span: 15 }} labelCol={{ span: 5 }}>
        <Item label='角色名称'>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入角色名称'
              }
            ]
          })(<Input placeholder='请输入角色名称' />)}
        </Item>
      </Form>
    );
  }
}

export default AddRoleForm;
