import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.redirects, action) {
  switch (action.type) {
    case actionType.REDIRECT_ACCESS_DENIED:
      return action.redirectMsg;
    default:
      return state;
  }
}
