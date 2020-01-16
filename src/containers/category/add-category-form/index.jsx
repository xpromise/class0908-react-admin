import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

@Form.create()
class AddCategoryForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string
  };

  render() {
    const {
      form: { getFieldDecorator },
      categoryName
    } = this.props;

    return (
      <Form>
        <Form.Item label='品类名称'>
          {getFieldDecorator('categoryName', {
            // 表单校验规则
            rules: [{ required: true, message: '请输入分类名称~' }],
            // 初始值
            initialValue: categoryName
          })(<Input placeholder='请输入分类名称' />)}
        </Form.Item>
      </Form>
    );
  }
}

export default AddCategoryForm;
