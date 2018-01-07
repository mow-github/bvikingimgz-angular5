import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.counters, action) {
  switch (action.type) {
    case actionType.COUNT_IMAGE:
      state.images += action.imgCount;
      return {...state};
    case actionType.COUNT_USER:
      state.users += action.userCount;
      return {...state};
    case actionType.COUNT_COMMENT:
      state.comments += action.commentCount;
      return {...state};
    case actionType.COUNT_USER_NEG:
      state.users -= action.userCount;
      return {...state};
    case actionType.TEST_COUNTER:
      state.comments += action.nr;
      return {...state};
    default:
      return state;
  }
}
