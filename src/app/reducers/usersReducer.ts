import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.users, action) {
  switch (action.type) {
    case actionType.SIGN_IN:
      action.user.userImages = []; // add a holder for userImages
      return action.user;
    case actionType.SIGN_OUT:
      return action.user;
    case actionType.POST_USER_IMAGE:

      state.userImages.push( action.image );
      return {...state};

    // return {...state, userImages: action.image};
    case actionType.POST_USER_IMAGE_INDEX:

      if(state.email){
        // do this only when we have a logged in user
        // Note: ( it exec when not logged in as well )
        // 1. add a empty images obj 1st time aka. holder
        // 2. add new image index when listen on post "users"

        if(!state.images){
          state.images = {};
        }
        state.images[action.imgid] = {[action.imgid]: true};
      }

      return {...state};
    case actionType.REMOVE_USER_IMAGE_INDEX:
      delete state.images[action.imgid];
      return {...state};
    default:
      return state;
  }
}


