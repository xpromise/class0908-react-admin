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

    /* const filterMenus = menus.reduce((p, c) => {
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
    }, []); */

    /*
      menus 所有菜单
      roleMenus 权限菜单
      完成: 通过处理，让menus中只包含用户权限roleMenus中允许访问的菜单
    */
    const filterMenus = menus.reduce((p, c) => {
      /*
        p 上一次遍历的返回值，默认值 []
        c 当前遍历元素的值：menu
      */

      /*
        深度克隆：
          比如：一开始使用jiaming账户登录（roleMenus: ['/category']）
            此时jiaming用户在商品菜单中只能看到 分类管理，看不到商品管理
            又因为 c.children = children;赋值操作，因为引用类型，改了值会修改之前的值。
            导致后面使用其他账户再次登录时，值被修改了（商品中只有分类管理，没有商品管理了）
            所以，后面所有登录就再也看不到商品管理
          根本原因：改了值会修改之前的值  
          解决：不能修改之前的值。 使用深度克隆克隆一份全新的值，对全新做任何修改，不会影响之前的值
      */
      c = JSON.parse(JSON.stringify(c));

      /*
        判断单个菜单路径(c.path)是否在权限菜单(roleMenus)中
        c.children判断是否有子菜单

        整个判断：
          如果单个菜单路径(c.path)在权限菜单中 或者 menu有子菜单 条件成立

          为什么menu有子菜单也要进来？
            比如，权限添加了商品管理和分类管理，最终roleMenus：['/products', '/category', '/product']
              此时父级菜单 '/products' 存在，roleMenus.indexOf(c.path) !== -1 成立
            权限只添加了商品管理，最终roleMenus：['/product']
              此时就没有父级菜单，roleMenus.indexOf(c.path) !== -1 不成立，但是也要添加商品管理。
              所以需要判断有没有子菜单，有的话需要特殊处理
      */
      if (roleMenus.indexOf(c.path) !== -1 || c.children) {

        if (c.children) {
          /*
            如果是二级菜单，判断所有子菜单是否在roleMenus中：
              如果全部在，就全部添加
              如果部分在，就过滤掉不需要的，保留需要的

              如果都不在，就不添加
          */

          // 过滤不属于roleMenus的二级菜单
          const children = c.children.filter(item => {
            /*
              遍历：判断子菜单的路径（item.path）是否在roleMenus中
              如果在，返回值true，就会保留
              如果不在，返回值false，就会被过滤掉
            */
            return roleMenus.indexOf(item.path) !== -1;
          });

          /*
            children是应该 全部在 ？ 部分在 ？ 都不在？ 
            所以需要判断length
          */
          if (!children.length) {
            // menu全部被过滤掉了~ 就不添加
            return p;
          }

          // 全部在 ？ 部分在 ？ 统一赋值
          // 主要解决 部分在 的问题
          c.children = children;

          // 最终执行后面代码，统一添加
        }
        // 如果只是一级菜单，肯定满足了在roleMenus中，所以添加进去
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
