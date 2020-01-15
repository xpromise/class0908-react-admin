const menus = [
  {
    title: 'home',
    icon: 'home',
    path: '/'
  },
  {
    title: 'products',
    icon: 'appstore',
    path: '/products',
    children: [
      {
        title: 'category',
        icon: 'bars',
        path: '/category'
      },
      {
        title: 'product',
        icon: 'tool',
        path: '/product'
      }
    ]
  },
  {
    title: 'user',
    icon: 'user',
    path: '/user'
  },
  {
    title: 'role',
    icon: 'safety-certificate',
    path: '/role'
  },
  {
    title: 'charts',
    icon: 'area-chart',
    path: '/charts',
    children: [
      {
        title: 'bar',
        icon: 'bar-chart',
        path: '/charts/bar'
      },
      {
        title: 'pie',
        icon: 'pie-chart',
        path: '/charts/pie'
      },
      {
        title: 'line',
        icon: 'line-chart',
        path: '/charts/line'
      }
    ]
  }
];

// 暴露
export default menus;
