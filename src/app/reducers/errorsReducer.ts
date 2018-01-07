import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.errors, action) {
  switch (action.type) {
    case actionType.FETCH_ERROR:
      return action.error.message;
    case actionType.UPDATE_ERROR:
      return action.error;
    default:
      return state;
  }
}


