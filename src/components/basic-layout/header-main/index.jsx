import React, { Component } from 'react';
import { Button, Icon, Modal } from 'antd';
import screenfull from 'screenfull';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { removeItem } from '$utils/storage';
import { removeUser } from '$redux/actions';
import './index.less';

@connect(state => ({ username: state.user.user && state.user.user.username }), {
  removeUser
})
@withRouter
class HeaderMain extends Component {
  state = {
    isScreenfull: false
  };

  componentDidMount() {
    screenfull.on('change', this.handleScreenFullChange);
  }

  handleScreenFullChange = () => {
    this.setState({
      isScreenfull: !this.state.isScreenfull
    });
  };

  componentWillUnmount() {
    screenfull.off('change', this.handleScreenFullChange);
  }

  screenFull = () => {
    // 因为ESC不能触发，但是change
    /* this.setState({
      isScreenfull: !this.state.isScreenfull
    }); */
    screenfull.toggle();
  };

  logout = () => {
    // 显示对话框
    Modal.confirm({
      title: '您确认要退出登录吗?',
      onOk: () => {
        // 清空用户数据
        removeItem('user');
        this.props.removeUser();
        // 跳转到/login
        this.props.history.replace('/login');
      }
      // onCancel: () => {}
    });
  };

  render() {
    const { isScreenfull } = this.state;
    const { username } = this.props;

    return (
      <div className='header-main'>
        <div className='header-main-top'>
          <Button size='small' onClick={this.screenFull}>
            <Icon type={isScreenfull ? 'fullscreen-exit' : 'fullscreen'} />
          </Button>
          <Button className='header-main-lang' size='small'>
            English
          </Button>
          <span>hello, {username}~~</span>
          <Button size='small' type='link' onClick={this.logout}>
            退出
          </Button>
        </div>
        <div className='header-main-bottom'>
          <span className='header-main-left'>商品管理</span>
          <span className='header-main-right'>2020/01/14 15:58:37</span>
        </div>
      </div>
    );
  }
}

export default HeaderMain;
