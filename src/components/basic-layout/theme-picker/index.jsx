import React, { Component } from 'react';
import { Icon, Drawer, Divider, Button } from 'antd';
import { SketchPicker } from 'react-color';

import { setItem, getItem } from '$utils/storage';

import './index.less';

/*
  注意：不能修改webpack配置，如果要修改，必须重启。
  主题切换功能：
    新建一个style标签，将要修改的样式添加上去。添加到页面中生效（覆盖之前的样式）
*/
const initColor = getItem('color') || '#1DA57A';

export default class ThemePicker extends Component {
  state = {
    visible: false,
    currentColor: initColor, // 当前选中的颜色
    prevColor: initColor // 上一次关闭抽屉组件选中的颜色
  };

  onClose = () => {
    const { prevColor } = this.state;

    this.setState({
      visible: false,
      // 颜色还原成之前的颜色
      currentColor: prevColor
    });
  };

  onOpen = () => {
    this.setState({
      visible: true
    });
  };

  handleChangeComplete = ({ hex }) => {
    // 十六进制的颜色 - 当前选中颜色
    // console.log(hex);
    this.setState({
      currentColor: hex
    });
  };

  componentDidMount() {
    // 只创建一次
    this.themeStyle = document.createElement('style');
    // 设置之前保存的主题色 (主题色的初始化)
    this.setColorStyle();
    // 并添加到页面上
    document.querySelector('head').appendChild(this.themeStyle);
  }

  setColorStyle = () => {
    const { currentColor } = this.state;

    this.themeStyle.innerHTML = `
      .ant-menu .ant-menu-item.ant-menu-item-selected, .theme-picker-btn{
        background-color: ${currentColor};
      }
      .header-main .header-main-top {
        border-bottom: 1px solid ${currentColor};
      }
      .ant-btn.ant-btn-link {
        color: ${currentColor};
      }
      .ant-btn.ant-btn-primary {
        background-color: ${currentColor};
        border-color: ${currentColor};
      }
    `;
  };

  changeTheme = () => {
    // 新建一个style标签，将要修改的样式添加上去。添加到页面中生效（覆盖之前的样式）
    /*
      问题：比如用户切换了10次主题色，就会创建10次style标签插入到页面上。
        1. 性能不好
        2. 前9次style都无效。
      解决: 复用style标签 (只创建一个，反复使用) 
    */
    const { currentColor } = this.state;
    // 1. 创建style标签
    // const style = document.createElement('style');
    // 2. 设置样式
    this.setColorStyle();
    // 3. 添加到页面中生效
    // document.querySelector('head').appendChild(style);

    // 将颜色保存在localStorage中，持久化存储
    setItem('color', currentColor);

    // 隐藏抽屉组件
    this.setState({
      visible: false,
      prevColor: currentColor
    });
  };

  render() {
    const { visible, currentColor } = this.state;

    return (
      <div>
        <div className='theme-picker-btn' onClick={this.onOpen}>
          <Icon type='setting' />
        </div>

        <Drawer
          title='主题颜色选择'
          placement='right'
          closable={false}
          onClose={this.onClose}
          visible={visible}
        >
          <SketchPicker
            color={currentColor} // 颜色选择器当前选中的颜色
            onChangeComplete={this.handleChangeComplete} // 当你选择其他颜色时触发的事件
          />
          <Divider />
          <Button onClick={this.onClose}>取消</Button> &nbsp;&nbsp;&nbsp;
          <Button type='primary' onClick={this.changeTheme}>
            确认
          </Button>
        </Drawer>
      </div>
    );
  }
}
