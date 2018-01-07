import * as actionType from '../actions/actionTypes';
import { INITIAL_STATE } from './initialState';

export default function (state = INITIAL_STATE.images, action) {
  switch (action.type) {
    case actionType.POST_IMAGE:
      return [...state, action.image];
    case actionType.REMOVE_IMAGE:
      return state.filter(image => image.imgid !== action.imgid);
    case actionType.GET_ALL_IMAGES:
      return action.images || [];
    /*    case actionType.PATCH_IMAGE:
          state.filter(image => {
            if(image.imgid === action.image.imgid){
              image.comments_tot = action.image.comments_tot;
              image.thumbs_down_tot = action.image.thumbs_down_tot;
              image.thumbs_up_tot = action.image.thumbs_up_tot;
            }
            return image;
          });
          return [...state];*/
    case actionType.PATCH_IMAGE_POST_COMMENT_INDEX:

      state.filter(image => {
        if(image.imgid === action.comment.imgid){
          // console.log("..",image);

          image.comments = {...image.comments,  [action.comment.cid]:{ [action.comment.cid]: true } };
        }
        return image;
      });

      return [...state];
    case actionType.PATCH_IMAGE_POST_VOTE_INDEX:

      state.filter(image => {
        if(image.imgid === action.vote.imgid){
          // console.log("..",image);

          image.votes = {...image.votes,  [action.vote.vid]:{ [action.vote.vid]: true } };
        }
        return image;
      });

      return [...state];

    case actionType.PATCH_IMAGE_THUMB_UP_1:

      state.filter(image => {
        if(image.imgid === action.imgid){
          image.thumbs_up_tot += 1;
        }
        return image;
      });

      return [...state];
    case actionType.PATCH_IMAGE_THUMB_DOWN_1:

      state.filter(image => {
        if(image.imgid === action.imgid){
          image.thumbs_down_tot += 1;
        }
        return image;
      });

      return [...state];
    case actionType.PATCH_IMAGE_COMMENT_UP_1:

      state.filter(image => {
        if(image.imgid === action.imgid){
          image.comments_tot += 1;
        }
        return image;
      });

      return [...state];
    default:
      return state;
  }
}


