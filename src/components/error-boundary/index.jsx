import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false
  };
  /*
    当定义了一下两个生命周期函数，就是错误边界组件：就能捕获子组件产生的错误，渲染备用方案
    这两个生命周期函数当子组件产生错误就会触发~

    注意：只有生产环境有效果，开发环境没有效果
  */
  static getDerivedStateFromError(error) {
    // 更新了状态
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    // 一般记录错误信息，反馈给后台
    console.log(error, info);
    // 发送请求，将错误信息发给后台去记录
    // 后台记录好之后，会将错误反馈前端，前端就得去改~
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      // 说明子组件出错了，正常情况下会整体奔溃（页面是白屏）
      // 使用了错误边界，渲染出备用DOM树
      // 最终结果：其他组件不会奔溃，而奔溃的组件会渲染下面这个元素
      return <div>哇喔，组件奔溃了，请联系管理员解决吧~~~</div>;
    }

    // 子组件没有出错
    return this.props.children;
  }
}
