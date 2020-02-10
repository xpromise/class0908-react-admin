import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

// 引入echarts中国城市数据
import cityData from 'echarts/map/json/china';
// 引入自己抓取中国城市数据疫情情况(写死了，将来可以在服务器实时更新数据，再去服务器请求数据)
import data from './county.json';

/*
  在React中使用echarts
  一个类似于丁香医生的疫情地图
*/
export default class Map extends Component {
  getOption = () => {
    // option对象具体参数：参照echarts文档
    return {
      // 地图标题
      title: {
        text: '疫情地图'
      },
      // 地图提示框组件。
      tooltip: {
        trigger: 'item',
        formatter: item => {
          return `省份: ${item.name} <br/> 确诊: ${item.value}`;
        }
      },
      // 地图怎么填充数据
      visualMap: {
        // 分段式填充
        type: 'piecewise',
        // 指定如何分段
        pieces: [
          { min: 10000, color: '#5c0011' }, // 不指定 max，表示 max 为无限大（Infinity）。
          { min: 1000, max: 10000, color: '#a8071a' },
          { min: 500, max: 999, color: '#f5222d' },
          { min: 100, max: 499, color: '#ff7875' },
          { min: 10, max: 99, color: '#ffccc7' },
          { min: 1, max: 9, color: '#fff1f0' }
        ]
      },
      // 地图数据
      series: [
        {
          name: '疫情数量',
          type: 'map', // 图表是地图类型
          mapType: 'china', // 自定义扩展图表类型
          label: {
            show: true
          },
          roam: 'scale', // 通过鼠标缩放
          scaleLimit: {
            // 缩放最小和最大比例
            min: 1,
            max: 5
          },
          // 数据  [{name, value}, {name, value}]
          data: data.map(item => {
            return {
              name: item.provinceShortName,
              value: item.confirmedCount
            };
          })
        }
      ]
    };
  };

  render() {
    /*
      1. 注册一个地图
        echarts.registerMap(城市地区拼音, 城市地图数据);
        比如：中国地图
           import chinaData from 'echarts/map/json/china';
           echarts.registerMap('china', chinaData);
        比如：广东地图
           import guangdongData from 'echarts/map/json/province/guangdong';
           echarts.registerMap("guangdong", guangdongData);
      2. 定义 option
    */
    echarts.registerMap('china', cityData);

    return (
      <ReactEcharts
        option={this.getOption()}
        style={{ width: '100%', height: 600 }}
        onEvents={{
          click: e => {
            console.log(e.data);
          }
        }}
      />
    );
  }
}
