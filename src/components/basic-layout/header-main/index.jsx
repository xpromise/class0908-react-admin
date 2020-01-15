import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

function HeaderMain({
  username,
  language,
  changeLanguage,
  location: { pathname },
  removeUser,
  intl,
  history
}) {
  // 定义state
  const [isScreenfull, setIsScreenfull] = useState(false);
  const [date, setDate] = useState(Date.now());
  // 缓存函数
  const handleScreenFullChange = useCallback(() => {
    setIsScreenfull(!isScreenfull);
  }, [isScreenfull]);

  // 相当于生命周期函数
  useEffect(() => {
    // 相当于componentDidMount
    screenfull.on('change', handleScreenFullChange);

    const timeId = setInterval(() => {
      setDate(Date.now());
    }, 1000);

    return () => {
      // 相当于componentWillUnmount
      screenfull.off('change', handleScreenFullChange);
      clearInterval(timeId);
    };
  });

  // 缓存函数
  const changeScreenFull = useCallback(() => {
    screenfull.toggle();
  }, []);

  // 缓存函数
  const logout = useCallback(() => {
    // 显示对话框
    Modal.confirm({
      title: intl.formatMessage({ id: 'logout' }),
      onOk: () => {
        // 清空用户数据
        removeItem('user');
        removeUser();
        // 跳转到/login
        history.replace('/login');
      }
    });
  }, [intl, history, removeUser]);

  // 缓存函数
  const changeLang = useCallback(() => {
    changeLanguage(language === 'en' ? 'zh-CN' : 'en');
  }, [language, changeLanguage]);

  // 缓存计算结果，一上来会调用一次
  const title = useMemo(() => {
    for (let index = 0; index < menus.length; index++) {
      const menu = menus[index];
      // 二级菜单
      if (menu.children) {
        for (let index = 0; index < menu.children.length; index++) {
          const cMenu = menu.children[index];
          if (cMenu.path === pathname) {
            return cMenu.title;
          }
        }
      } else {
        if (menu.path === pathname) {
          return menu.title;
        }
      }
    }
  }, [pathname]);

  return (
    <div className='header-main'>
      <div className='header-main-top'>
        <Button size='small' onClick={changeScreenFull}>
          <Icon type={isScreenfull ? 'fullscreen-exit' : 'fullscreen'} />
        </Button>
        <Button className='header-main-lang' size='small' onClick={changeLang}>
          {language === 'en' ? '中文' : 'English'}
        </Button>
        <span>hello, {username}~~</span>
        <Button size='small' type='link' onClick={logout}>
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

export default injectIntl(
  connect(
    state => ({
      username: state.user.user && state.user.user.username,
      language: state.language
    }),
    {
      removeUser,
      changeLanguage
    }
  )(withRouter(HeaderMain))
);
