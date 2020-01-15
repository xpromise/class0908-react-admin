import React, { useMemo, useCallback } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import menus from '$conf/menus';

const { SubMenu, Item } = Menu;

function LeftNav({ location: { pathname } }) {
  const createMenuItem = useCallback(menu => {
    return (
      <Item key={menu.path}>
        <Link to={menu.path}>
          <Icon type={menu.icon} />
          <span>
            <FormattedMessage id={menu.title} />
          </span>
        </Link>
      </Item>
    );
  }, []);

  // 缓存内部函数计算结果
  // 一上来就会调用一次，然后缓存计算结果
  const menuList = useMemo(() => {
    return menus.map(menu => {
      if (menu.children) {
        // 二级菜单
        return (
          <SubMenu
            key={menu.path}
            title={
              <span>
                <Icon type={menu.icon} />
                <span>
                  <FormattedMessage id={menu.title} />
                </span>
              </span>
            }
          >
            {menu.children.map(cMenu => createMenuItem(cMenu))}
          </SubMenu>
        );
      } else {
        // 一级菜单
        return createMenuItem(menu);
      }
    });
  }, [createMenuItem]);

  const findOpenKeys = useCallback((pathname, menus) => {
    /*
      遍历数据，找某个元素。
        当返回值是true，就找到了，并找到的值返回
        当返回值是false，接着遍历找
          直到全部遍历完，没有找到返回undefined
    */
    const menu = menus.find(menu => {
      /* if (menu.children) {
        return menu.children.find(cMenu => cMenu.path === pathname);
      } */
      return (
        menu.children && menu.children.find(cMenu => cMenu.path === pathname)
      );
    });

    if (menu) {
      return menu.path;
    }
  }, []);

  const openKey = findOpenKeys(pathname, menus);

  return (
    <Menu
      theme='dark' // 主题色
      defaultSelectedKeys={[pathname]} // 默认选中的菜单
      defaultOpenKeys={[openKey]} // 默认展开的菜单
      mode='inline'
    >
      {menuList}
    </Menu>
  );
}

// withRouter 高阶组件：给子组件传递路由组件的三大属性
export default withRouter(LeftNav);
