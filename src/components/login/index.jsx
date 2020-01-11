import React, { Component } from 'react';

import { Form, Input, Button, Icon } from 'antd';

// 图片必须引入，才会被webpack打包
import logo from './logo.png';
import './index.less';

@Form.create()
class Login extends Component {
  render() {
    // getFieldDecorator 高阶组件：用来表单校验
    const { getFieldDecorator } = this.props.form;

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-section'>
          <h3>用户登录</h3>
          <Form className='login-form'>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空'
                  },
                  {
                    min: 4,
                    message: '用户名必须大于3位'
                  },
                  {
                    max: 15,
                    message: '用户名必须小于15位'
                  },
                  {
                    pattern: /^\w$/,
                    message: '用户名只能包含英文、数字、下划线'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='用户名'
                />
              )}
            </Form.Item>
            <Form.Item>
              <Input
                prefix={
                  <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder='密码'
              />
            </Form.Item>
            <Form.Item>
              <Button className='login-form-btn' type='primary'>
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

// Form.create()(Login) 高阶组件：给Login传递form属性
// export default Form.create()(Login);
export default Login;
