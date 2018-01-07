import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.loading, action) {
  switch (action.type) {
    case actionType.TOGGLE_LOADING:
      return action.loadingFlag;
    default:
      return state;
  }
}
