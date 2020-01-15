import React, { useCallback } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import { connect } from 'react-redux';

import { saveUserAsync } from '$redux/actions';
import withCheckLogin from '$cont/with-check-login';

// 图片必须引入，才会被webpack打包
import logo from '../../assets/imgs/logo.png';
import './index.less';

const { Item } = Form;

function Login({
  form: { getFieldDecorator, validateFields, resetFields },
  history,
  saveUserAsync
}) {
  // 自定义表单校验规则
  const validator = useCallback((rule, value, callback) => {
    /*
        rule.field 获取表单key
        value 获取表单value
      */
    // console.log(rule, value);

    const name = rule.field === 'username' ? '用户名' : '密码';

    const reg = /^\w+$/;

    if (!value) {
      // 输入值为空
      callback(`${name}不能为空`);
    } else if (value.length < 4) {
      callback(`${name}必须大于4位`);
    } else if (value.length > 15) {
      callback(`${name}必须小于15位`);
    } else if (!reg.test(value)) {
      callback(`${name}只能包含英文、数字、下划线`);
    }
    /*
        callback() 调用不传参，代表表单校验成功
        callback(message) 调用传参，代表表单校验失败，会提示message错误
      */
    // 必须要调用，否则会出问题
    callback();
  }, []);

  const login = useCallback(
    e => {
      e.preventDefault();
      // 校验表单并收集表单数据
      validateFields((err, values) => {
        if (!err) {
          // 表单校验成功
          const { username, password } = values;
          // 发送请求，请求登录
          // 得到登录成功/失败
          saveUserAsync(username, password)
            .then(() => {
              history.replace('/');
            })
            .catch(msg => {
              message.error(msg);
              resetFields(['password']);
            });
        }
      });
    },
    [history, saveUserAsync, resetFields, validateFields]
  );

  return (
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt='logo' />
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className='login-section'>
        <h3>用户登录</h3>
        <Form className='login-form' onSubmit={login}>
          <Item>
            {getFieldDecorator('username', {
              rules: [
                {
                  validator: validator
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
                  validator: validator
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
            <Button className='login-form-btn' type='primary' htmlType='submit'>
              登录
            </Button>
          </Item>
        </Form>
      </section>
    </div>
  );
}

export default withCheckLogin(
  connect(null, { saveUserAsync })(Form.create()(Login))
);
