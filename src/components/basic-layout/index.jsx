import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import LeftNav from './left-nav';
import HeaderMain from './header-main';
import withCheckLogin from '$cont/with-check-login';

import logo from '../../assets/imgs/logo.png';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;

@withCheckLogin
class BasicLayout extends Component {
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
            <h1 style={{ display: isDisplay ? 'block' : 'none' }}>
              <FormattedMessage id='title' />
            </h1>
          </div>
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, height: 80 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '30px 16px 0 16px' }}>
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

export default BasicLayout;
