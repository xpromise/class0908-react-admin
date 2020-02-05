import React, { Component } from 'react';
import { Button, Icon, Modal } from 'antd';
import screenfull from 'screenfull';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { removeItem } from '$utils/storage';
import { removeUser, changeLanguage } from '$redux/actions';
import menus from '$conf/menus';
import './index.less';

@injectIntl
@connect(
  state => ({
    username: state.user.user && state.user.user.username,
    language: state.language
  }),
  {
    removeUser,
    changeLanguage
  }
)
@withRouter
class HeaderMain extends Component {
  state = {
    isScreenfull: false,
    date: Date.now()
  };

  componentDidMount() {
    screenfull.on('change', this.handleScreenFullChange);

    this.timeId = setInterval(() => {
      this.setState({
        date: Date.now()
      });
    }, 1000);
  }

  handleScreenFullChange = () => {
    this.setState({
      isScreenfull: !this.state.isScreenfull
    });
  };

  componentWillUnmount() {
    screenfull.off('change', this.handleScreenFullChange);

    clearInterval(this.timeId);
  }

  screenFull = () => {
    // 因为ESC不能触发，但是change
    /* this.setState({
      isScreenfull: !this.state.isScreenfull
    }); */
    screenfull.toggle();
  };

  logout = () => {
    const { intl } = this.props;
    // 显示对话框
    Modal.confirm({
      title: intl.formatMessage({ id: 'logout' }),
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

  changeLanguage = () => {
    const language = this.props.language === 'en' ? 'zh-CN' : 'en';
    this.props.changeLanguage(language);
  };

  findTitle = (menus, pathname) => {
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index];
      // 二级菜单
      if (menu.children) {
        for (let index = 0; index < menu.children.length; index++) {
          const cMenu = menu.children[index];
          // 如果pathname是 /product 返回 product
          // 如果pathname是 /product/add 返回 product
          // cMenu.path是 /product
          if (pathname.indexOf(cMenu.path) !== -1) {
            return cMenu.title;
          }
        }
      } else {
        // 一级菜单
        if (menu.path === pathname) {
          return menu.title;
        }
      }
    }
  };

  render() {
    const { isScreenfull, date } = this.state;
    const {
      username,
      language,
      location: { pathname }
    } = this.props;
    
    const title = this.findTitle(menus, pathname);
    // title找不到。
    // console.log(title);

    return (
      <div className='header-main'>
        <div className='header-main-top'>
          <Button size='small' onClick={this.screenFull}>
            <Icon type={isScreenfull ? 'fullscreen-exit' : 'fullscreen'} />
          </Button>
          <Button
            className='header-main-lang'
            size='small'
            onClick={this.changeLanguage}
          >
            {language === 'en' ? '中文' : 'English'}
          </Button>
          <span>hello, {username}~~</span>
          <Button size='small' type='link' onClick={this.logout}>
            退出
          </Button>
        </div>
        <div className='header-main-bottom'>
          <span className='header-main-left'>
            <FormattedMessage id={title} />
          </span>
          <span className='header-main-right'>
            {dayjs(date).format('YYYY/MM/DD HH:mm:ss')}
          </span>
        </div>
      </div>
    );
  }
}

export default HeaderMain;
