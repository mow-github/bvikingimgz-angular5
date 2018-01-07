import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.comments, action) {
  switch (action.type) {
    case actionType.POST_COMMENT:
      return [...state, action.comment];
    case actionType.GET_COMMENT_ALL:
      return action.comment;
    case actionType.REMOVE_COMMENT:
      return state.filter(comment => comment.cid !== action.cid);
    case actionType.PATCH_COMMENT:

      state.filter(comment => {
        if(comment.cid === action.comment.cid){
          comment.text = action.comment.text;
        }
        return comment;
      });

      return [...state];
    case actionType.RESET_COMMENT:
      return action.comment;
    case actionType.CLEAR_COMMENTS:
      return [];
    default:
      return state;
  }
}


