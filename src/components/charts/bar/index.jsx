import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
/*
  在React中使用echarts
*/
export default class Bar extends Component {
  getOption = () => {
    // option对象具体参数：参照echarts文档
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
  };

  render() {
    return <ReactEcharts option={this.getOption()} />;
  }
}
