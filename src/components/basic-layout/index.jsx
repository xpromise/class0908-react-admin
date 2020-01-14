import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import LeftNav from './left-nav';
import logo from '../../assets/imgs/logo.png';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;

export default class BasicLayout extends Component {
  state = {
    collapsed: false,
    isDisplay: true
  };

  onCollapse = collapsed => {
    const { isDisplay } = this.state;
    this.setState({
      collapsed,
      isDisplay: !isDisplay
    });
  };

  render() {
    const { isDisplay, collapsed } = this.state;
    const { children } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className='layout-logo'>
            <img src={logo} alt='logo' />
            <h1 style={{ display: isDisplay ? 'block' : 'none' }}>硅谷后台</h1>
          </div>
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
