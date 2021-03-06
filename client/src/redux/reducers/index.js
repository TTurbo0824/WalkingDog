import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './user';
import dogwalker from './dogwalker';
import request from './request';
import history from './history';
import rating from './rating';
import review from './review';

const persistConfig = {
  key: 'root',
  storage: storage
};

const rootReducer = combineReducers({
  user,
  dogwalker,
  request,
  history,
  rating,
  review
});

export default persistReducer(persistConfig, rootReducer);
