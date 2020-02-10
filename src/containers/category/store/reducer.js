import {
  GET_CATEGORY_LIST,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
} from './action-types';

// 不能修改原数据，store是只读的
const initCategories = [];
function categories(prevState = initCategories, action) {
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return action.data;
    case ADD_CATEGORY:
      return [...prevState, action.data];
    case UPDATE_CATEGORY:
      return prevState.map(category => {
        if (category._id === action.data._id) {
          return action.data;
        }
        return category;
      });
    case DELETE_CATEGORY:
      return prevState.filter(category => category._id !== action.data);
    default:
      return prevState;
  }
}

export default categories;
