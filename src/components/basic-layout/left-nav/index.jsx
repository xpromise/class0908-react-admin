import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import menus from '$conf/menus';

const { SubMenu, Item } = Menu;

@connect(state => ({ roleMenus: state.user.user.menus }))
// withRouter 高阶组件：给子组件传递路由组件的三大属性
@withRouter
class LeftNav extends Component {
  createMenus = menus => {
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
            {menu.children.map(cMenu => this.createMenuItem(cMenu))}
          </SubMenu>
        );
      } else {
        // 一级菜单
        return this.createMenuItem(menu);
      }
    });
  };

  createMenuItem = menu => {
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
  };

  findOpenKeys = (pathname, menus) => {
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
  };

  render() {
    let { pathname } = this.props.location;

    // pathname 可能是 /product/add
    // 如果pathname包含/product，就改成/product
    if (pathname.indexOf('/product') !== -1) {
      pathname = '/product';
    }
    // 获取用户的权限
    const roleMenus = this.props.roleMenus;
    // menus是所有权限：我们需要获取用户可以访问的权限，要进行过滤处理
    // 我们进行权限处理时，有可能只要保留其中一部分，不能用filter方法
    /*
      比如：
        menus --> 
        [{
          path: '/products',
          children: [
            {
              path: '/category'
            },
            {
              path: '/product'
            }
          ]
        }, ...]

        roleMenus -->
          ['/', '/category']
         
        经过处理，最终变成：
        [{
          path: '/products',
          children: [
            {
              path: '/category'
            }
          ]
        }, ...]

    */
    /* 
    // 问题：可能会被添加两次
    menus = menus.reduce((p, c) => {
      // 遍历一级菜单
      // 判断遍历的menu菜单，是否在用户权限列表中
      if (roleMenus.indexOf(c.path) !== -1) {
        p.push(c);
      }
      // 二级菜单
      if (c.children) {
        // 如果子菜单path在roleMenus中，返回值false, 就不会过滤
        // 如果子菜单path不在roleMenus中，返回值true, 就会被过滤掉
        c.children = c.children.filter(
          item => roleMenus.indexOf(item.path) === -1
        );
        p.push(c);
      }
      // 如果在就添加进行，如果不在就不要
      return p;
    }, []); */

    /* const filterMenus = menus.reduce((p, c) => {
      // 如果一级菜单不属于权限列表，并也没有二级菜单
      if (roleMenus.indexOf(c.path) === -1 && !c.children) {
        // 就不添加了
        return p;
      }
      // 二级菜单
      if (c.children) {
        // 如果子菜单path在roleMenus中，返回值true, 就不会过滤
        // 如果子菜单path不在roleMenus中，返回值false, 就会被过滤掉
        const children = c.children.filter(
          item => roleMenus.indexOf(item.path) !== -1
        );
        // 如果子菜单过滤后是空数组，是会显示菜单的，但是实际上是不需要的
        // 不需要整个菜单都不需要添加
        if (!children.length) {
          return p;
        }

        c.children = children;
      }
      // 统一添加
      p.push(c);
      // 如果在就添加进行，如果不在就不要
      return p;
    }, []);
 */

    const filterMenus = menus.reduce((p, c) => {
      // 对c --> 遍历出来的菜单，进行深度克隆 --> 后面操作就不会影响原数据
      c = JSON.parse(JSON.stringify(c));
      // 如果一级菜单不属于权限列表，并也没有二级菜单
      // if (roleMenus.indexOf(c.path) === -1 && !c.children) {
      if (roleMenus.indexOf(c.path) !== -1 || c.children) {
        // 二级菜单
        if (c.children) {
          // 如果子菜单path在roleMenus中，返回值true, 就不会过滤
          // 如果子菜单path不在roleMenus中，返回值false, 就会被过滤掉
          const children = c.children.filter(item => {
            return roleMenus.indexOf(item.path) !== -1;
          });
          // 如果子菜单过滤后是空数组，是会显示菜单的，但是实际上是不需要的
          // 不需要整个菜单都不需要添加
          if (!children.length) {
            return p;
          }
          // c.children直接赋值 --> 修改了原数组 --> menus数组
          // jiaming测试时，将menus数组的 /product 删掉了
          // peihua测试时，此时menus数组中就没有 /product。
          // 解决：不能修改原数组
          c.children = children;
        }
        // 统一添加
        p.push(c);
      }

      return p;
    }, []);

    const openKey = this.findOpenKeys(pathname, filterMenus);

    return (
      <Menu
        theme='dark' // 主题色
        defaultSelectedKeys={[pathname]} // 默认选中的菜单
        defaultOpenKeys={[openKey]} // 默认展开的菜单
        mode='inline'
      >
        {this.createMenus(filterMenus)}
      </Menu>
    );
  }
}

export default LeftNav;
