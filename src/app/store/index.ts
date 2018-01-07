import { combineReducers } from 'redux';
import { IAppState } from '../reducers/initialState';

import loading from '../reducers/loadingReducer';
import redirects from '../reducers/redirectsReducer';
import users from '../reducers/usersReducer';
import usersall from '../reducers/usersallReducer';
import errors from '../reducers/errorsReducer';
import images from '../reducers/imagesReducer';
import comments from '../reducers/commentsReducer';
import counters from '../reducers/countersReducer';

export const rootReducer = combineReducers<IAppState>({
  loading,
  redirects,
  users,
  usersall,
  errors,
  images,
  comments,
  counters,
});

