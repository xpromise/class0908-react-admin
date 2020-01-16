import Home from '../components/home';
import Category from '../containers/category';
import Product from '../containers/product';

const routes = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/category',
    component: Category,
    exact: true
  },
  {
    path: '/product',
    component: Product,
    exact: true
  }
];

export default routes;
