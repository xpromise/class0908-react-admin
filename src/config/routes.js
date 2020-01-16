import Home from '../components/home';
import Category from '../containers/category';

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
  }
];

export default routes;