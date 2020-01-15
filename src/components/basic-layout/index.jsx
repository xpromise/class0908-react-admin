import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import { FormattedMessage } from 'react-intl';
import LeftNav from './left-nav';
import HeaderMain from './header-main';
import withCheckLogin from '$cont/with-check-login';

import logo from '../../assets/imgs/logo.png';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;

function BasicLayout({ children }) {
  // useState: 能让纯函数组件使用state
  const [collapsed, setCollapsed] = useState(false);
  const [isDisplay, setIsDisplay] = useState(true);

  // useCallback：能缓存函数，重新渲染时不会重复创建
  const memorizedCollapse = useCallback(
    collapsed => {
      setIsDisplay(!isDisplay);
      setCollapsed(collapsed);
    },
    [isDisplay]
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={memorizedCollapse}>
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

export default withCheckLogin(BasicLayout);
