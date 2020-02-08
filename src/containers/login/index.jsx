import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import { connect } from 'react-redux';

import { saveUserAsync } from '$redux/actions';
import withCheckLogin from '$cont/with-check-login';
import { validator } from '$utils/tools';

// 图片必须引入，才会被webpack打包
import logo from '../../assets/imgs/logo.png';
import './index.less';

const { Item } = Form;

@withCheckLogin
@connect(null, { saveUserAsync })
@Form.create()
class Login extends Component {

  login = e => {
    e.preventDefault();

    // 校验表单
    // 收集表单数据
    // 发送请求，请求登录

    // 校验表单并收集表单数据
    this.props.form.validateFields((err, values) => {
      /*
        err 错误对象
          如果表单校验失败，就有错误，值是对象
          如果表单校验成功，就没有错误，值是null
        values
          收集的表单数据
      */

      if (!err) {
        // 表单校验成功
        const { username, password } = values;
        // 发送请求，请求登录
        //#region
        /* axios
          .post('/api/login', { username, password })
          .then(response => {
            // 请求成功

            // 判断是否登录成功
            if (response.data.status === 0) {
              // 登录成功
              // 跳转到home页面
              // 不能跳转（只能用于render方法中） 路由链接跳转
              // return <Redirect to="/" />
              // 编程式导航（用于非render方法中）
              this.props.history.replace('/');
            } else {
              // 登录失败
              // 提示错误
              message.error(response.data.msg);
              // 清空密码
              this.props.form.resetFields(['password']);b
            }
          })
          .catch(err => {
            // 请求失败
            console.log(err);
            // 提示错误
            message.error('网络错误~');
            // 清空密码
            this.props.form.resetFields(['password']);
          }); */
        //#endregion

        // 得到登录成功/失败
        this.props
          .saveUserAsync(username, password)
          .then(() => {
            this.props.history.replace('/');
          })
          .catch(msg => {
            message.error(msg);
            this.props.form.resetFields(['password']);
          });
      }
    });
  };

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
          <Form className='login-form' onSubmit={this.login}>
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  /* {
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
                    pattern: /^\w+$/,
                    message: '用户名只能包含英文、数字、下划线'
                  } */
                  {
                    required: true,
                    message: '用户名不能为空'
                  },
                  {
                    validator
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
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空'
                  },
                  {
                    validator
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='密码'
                  type='password'
                />
              )}
            </Item>
            <Item>
              <Button
                className='login-form-btn'
                type='primary'
                htmlType='submit'
              >
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

// Form.create()(Login) 高阶组件：给Login传递form属性
// export default Form.create()(Login);
export default Login;
