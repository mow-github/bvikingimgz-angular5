import * as actionType from './actionTypes';
import * as firebase from "firebase";

// ------------------------------------- SIGN IN USER -----------------------------------------
export function userChangedIn(userData) {
  return function(dispatch){
    dispatch({  type: actionType.SIGN_IN, user: userData  });
  };
}
export function userChangedOut() {
  return { type: actionType.SIGN_OUT, user: "" };
}


// ------------------------------------- IMAGES -----------------------------------------
export function postImages(imageObj) {
  return function(dispatch){
    const uid = firebase.auth().currentUser.uid;
    const imageObjUpd = {...imageObj, uid};
    firebase.database().ref("images").push(imageObjUpd).then((image) => {
      return image.key;
    }).then((imgid) => {
      firebase.database().ref(`users/${uid}/images/${imgid}`).set({[imgid]: true});
    })
  };
}
export function removeImage(image, currentUserRole){
  //console.log("---removeImage");
  return function(dispatch){

    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        //console.log("just a admin -- removeImage");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === image.uid ){
        // access to currentUser comments
        //console.log("subscriber and owner of the image -- removeImage");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        //console.log("FlAG TRUE",image);

        if(image.comments){
          const commentsArray = Object.keys(image.comments);
          commentsArray.forEach((cid) => {
            firebase.database().ref(`comments/${cid}`).remove();
            firebase.database().ref(`users/${image.uid}/comments/${cid}`).remove();
          });
        }

        if(image.votes){
          const votesArray = Object.keys(image.votes);
          votesArray.forEach((vid) => {
            firebase.database().ref(`votes/${vid}`).remove();
            firebase.database().ref(`users/${image.uid}/votes/${vid}`).remove();
          });
        }


        firebase.database().ref(`images/${image.imgid}`).remove().then(() => {
        }).then(() => {
          firebase.database().ref(`users/${image.uid}/images/${image.imgid}`).remove();
        }).then(() => {
          //console.log("images/image.imgid");
          //console.log("users/image.uid/images/image.imgid removed");
        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }else{
      const msg = "You are not logged in.. unable to exec. your request";
      dispatch({type: "FETCH_ERROR", error:{message: msg} })
    }

  };
}

// ------------------------------------- LISTENER IMAGES -----------------------------------------
export function postImagesListener(){
  return function(dispatch) {
    firebase.database().ref("images")
      .on("child_added", (ss) => {
        const image = {...ss.val(), imgid: ss.key};
        const currentUser = firebase.auth().currentUser;

        dispatch({type: actionType.POST_IMAGE, image});
        dispatch({type: actionType.COUNT_IMAGE, imgCount: 1});
        if( currentUser ){
          dispatch({
            type: actionType.POST_USER_IMAGE_INDEX,
            imgid: image.imgid
          });
        }

      });
  }
}

export function removeImageListener() {
  return function(dispatch) {
    firebase.database().ref("images")
      .on("child_removed", (ss) => {
        const image = {uid: ss.val().uid, imgid: ss.key};
        const currentUser = firebase.auth().currentUser;

        dispatch({ type: actionType.REMOVE_IMAGE, imgid: image.imgid });

        firebase.database().ref(`users/${image.uid}/images/${image.imgid}`).remove().then(() => {
          // TODO move this to another fn ?.

          dispatch({
            type: actionType.COUNT_IMAGE,
            imgCount: -1
          });

        }).catch((error) => {
          dispatch({type: "FETCH_ERROR", error})
        });

        if( currentUser ){
          dispatch({
            type: actionType.REMOVE_USER_IMAGE_INDEX,
            imgid: image.imgid
          });
        }

      });
  }
}
// ------------------------------------- LISTENER USERS -----------------------------------------
export function getAllUsers(){
  return function(dispatch){

    if(firebase.auth().currentUser) {

      firebase.database().ref(`users`).once("value").then((user) => {

        let usersall = [];
        user.forEach(function(childUser){
          const childUserObj = {...childUser.val(), uid: childUser.key};
          usersall.push(childUserObj);
        });
        dispatch({ type: actionType.GET_ALL_USERS, usersall });
      })

    }

  }
}
export function updateUserRole(user){
  return function(dispatch){

//console.log("---updateUserRole");
    if(firebase.auth().currentUser) {

      user.role = user.role === "admin" ? "subscriber" : "admin";
      let userNoUid = {...user};
      delete userNoUid.uid;

      firebase.database().ref(`users/${user.uid}`).set(userNoUid).then(() => {
        //console.log("updated user role FB");
        dispatch({ type: actionType.PATCH_USER_ROLE, user });
      }).catch((error) => {
        dispatch({type: "FETCH_ERROR", error})
      });



    }

  }
}
export function removeLoggedinUserFB() {
  return function(dispatch){

    try{

      const uid = firebase.auth().currentUser.uid;

      firebase.auth().currentUser.delete().then(() => {
        firebase.database().ref(`users/${uid}`).remove();
      }).then(() => {
        //console.log("remove Loggedin User FB + user FB row");
      }).catch((error) => {
        dispatch({type: "FETCH_ERROR", error})
      });

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}
export function postUsersListener() {
  return function(dispatch) {
    firebase.database().ref("users")
      .on("child_added", (ss) => {
        dispatch({ type: actionType.COUNT_USER, userCount: 1 });
    })
  }
}

export function removeUsersListener() {
  return function(dispatch) {
    firebase.database().ref("users").on("child_removed", (ss) => {
      const { votes, images, comments } = ss.val();

      dispatch({
        type: actionType.COUNT_USER_NEG,
        userCount: 1
      });

      if(votes){
        const votesArray = Object.keys(votes);
        votesArray.forEach((vid) => {
          firebase.database().ref(`votes/${vid}`).remove();
        });
      }

      if(images){
        const imagesArray = Object.keys(images);
        imagesArray.forEach((imgid) => {
          firebase.database().ref(`images/${imgid}`).remove();
        });
      }

      if(comments){
        const commentsArray = Object.keys(comments);
        commentsArray.forEach((cid) => {
          firebase.database().ref(`comments/${cid}`).remove();
        });
      }
    })
  }
}
// ------------------------------------- LISTENER USERS -----------------------------------------

// ------------------------------------- LISTENER VOTES -----------------------------------------
export function postVote(voteObj) {

  return function(dispatch){

    try{

      const {uid} = firebase.auth().currentUser;
      voteObj.uid = uid;
      //console.log("---", voteObj);

      firebase.database().ref("votes").push(voteObj).then((vote) => {
        const voteObjUpd = {...voteObj, vid: vote.key};
        //console.log( ",", voteObjUpd );

        // dispatch({ type: actionType.POST_VOTE, vote: voteObjUpd });
        dispatch({
          type: actionType.PATCH_IMAGE_POST_VOTE_INDEX,
          vote: voteObjUpd
        });

        return vote.key;
      }).then((vid) => {
        firebase.database().ref(`users/${uid}/votes/${vid}`).set({[vid]: true});
        firebase.database().ref(`images/${voteObj.imgid}/votes/${vid}`).set({[vid]: true})
      })

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}
export function postVotesListener() {
  return function(dispatch) {
    firebase.database().ref("votes")
      .on("child_added", (ss) => {

        const vote = {...ss.val(), vid: ss.key};

        // //console.log("child_added -- vote listener", vote);
        if(vote.value === 1){
          dispatch({
            type: actionType.PATCH_IMAGE_THUMB_UP_1,
            imgid: vote.imgid
          });
        }else if(vote.value === -1){
          dispatch({
            type: actionType.PATCH_IMAGE_THUMB_DOWN_1,
            imgid: vote.imgid
          });
        }
      })
  }
}

export function removeVotesListener() {
  return function(dispatch) {
    firebase.database().ref("votes")
      .on("child_removed", (ss) => {

        //const vote = {...ss.val(), vid: ss.key};
        //console.log( vote );
        //console.log("------------------------VOTES REMOVED - not active in app.js yet");


      })
  }
}
// ------------------------------------- LISTENER VOTES -----------------------------------------

// ------------------------------------- LISTENER COMMENTS -----------------------------------------
export function getComments(imgid) {
  return function(dispatch){

    if(firebase.auth().currentUser){

      firebase.database().ref(`images/${imgid}/comments`).once("value").then((cidIndices) => {

        if(!cidIndices.val()){
          dispatch({
            type: actionType.GET_COMMENT_ALL,
            comment: []
          });
          throw Error("this image has no comments");
        }
        const cidIndicesArray = Object.keys(cidIndices.val());

        const tmpArray = [];
        firebase.database().ref(`comments`).once("value").then((comments) => {
          cidIndicesArray.forEach((cid) => {
            ////console.log( cid );
            const commentObj = {...comments.val()[cid], cid};
            tmpArray.push(commentObj);
          });

          dispatch({
            type: actionType.GET_COMMENT_ALL,
            comment: tmpArray
          });

        })


      }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

    }else{
      // message
      const msg = "You are not logged in.. unable to fetch comments";
      //console.log(msg);
      // hmm, unable to exec due to rendering component ?
      dispatch({type: "FETCH_ERROR", error:{message: msg} })
    }

  };

}
export function clearComments() {
  return function(dispatch) {
    dispatch({type: actionType.CLEAR_COMMENTS});
  }
}
export function postComment(commentObj) {

  return function(dispatch){

    try{

      const {uid, email} = firebase.auth().currentUser;
      commentObj.uid = uid;
      commentObj.email = email;

      firebase.database().ref("comments").push(commentObj).then((comment) => {

        const commentObjUpd = {...commentObj, cid: comment.key};
        dispatch({
          type: actionType.POST_COMMENT,
          comment: commentObjUpd
        });

        dispatch({
          type: actionType.PATCH_IMAGE_POST_COMMENT_INDEX,
          comment: commentObjUpd
        });

        return comment.key;
      }).then((cid) => {
        firebase.database().ref(`users/${uid}/comments/${cid}`).set({[cid]: true});
        firebase.database().ref(`images/${commentObj.imgid}/comments/${cid}`).set({[cid]: true})
      })

    }catch(error){ dispatch({type: "FETCH_ERROR", error}) }

  };

}
export function removeComment(comment, currentUserRole) {

  /*
  * currentUserRole:  admin / subscriber
  *   - IF subscriber can remove: firebase.auth().currentUser.uid === comment.uid  // author of the comment
  *   - IF admin can remove: if logged in // remove every comment
  *
  *
  * */

  return function(dispatch){


    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        //console.log("just a admin -- removeComment");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === comment.uid ){
        // access to currentUser comments
        //console.log("subscriber and owner of the comment -- removeComment");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        //console.log("FlAG TRUE");
        //console.log(comment);

        firebase.database().ref(`comments/${comment.cid}`).remove().then(() => {
        }).then(() => {
          firebase.database().ref(`images/${comment.imgid}/comments/${comment.cid}`).remove();
        }).then(() => {
          firebase.database().ref(`users/${comment.uid}/comments/${comment.cid}`).remove();
        }).then(() => {
          //console.log("comments/cid removed");
          //console.log("images/imgid/comments/cd removed");
          //console.log("users/uid/comments/cid removed");
        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }


  };

}
export function updateComment(comment, currentUserRole) {

  /*
  * currentUserRole:  admin / subscriber
  *   - IF subscriber can remove: firebase.auth().currentUser.uid === comment.uid  // author of the comment
  *   - IF admin can remove: if logged in // remove every comment
  *
  *
  * */

  return function(dispatch){


    if(firebase.auth().currentUser){

      const currentUserUid = firebase.auth().currentUser.uid;

      let flag = false;
      if(currentUserRole === "admin"){
        // full access
        //console.log("just a admin -- updateComment");
        flag = true;
      }else if( currentUserRole === "subscriber" && currentUserUid === comment.uid ){
        // access to currentUser comments
        //console.log("subscriber and owner of the comment -- updateComment");
        flag = true;
      }else{
        const msg = "You are not the author or a admin";
        dispatch({type: "FETCH_ERROR", error:{message: msg} })
      }

      if(flag) {
        //console.log("FlAG TRUE");

        //console.log(comment);
        // we add a extra key/value: cid ( must exist.. so the path works, not neceassry in the patch )
        firebase.database().ref(`comments/${comment.cid}`).set(comment).then(() => {

        }).catch(error =>dispatch({type: "FETCH_ERROR", error}))

      }

    }


  };

}
export function updateCommentsListener(){
  return function(dispatch){
    firebase.database().ref("comments").on("child_changed", (ss) => {
      const cid = ss.key;
      dispatch({  type: actionType.PATCH_COMMENT, comment: {...ss.val(), cid } });
    })
  }
}
export function postCommentsListener() {
  return function(dispatch) {
    firebase.database().ref("comments")
      .on("child_added", (ss) => {

        const comment = {...ss.val(), cid: ss.key};
        dispatch({  type: actionType.PATCH_IMAGE_COMMENT_UP_1, imgid: comment.imgid });
        dispatch({  type: actionType.COUNT_COMMENT, commentCount: 1 });
      })
  }
}
export function removeCommentsListener() {
  return function(dispatch) {
    firebase.database().ref("comments").on("child_removed", (ss) => {
      const cid = ss.key;
      dispatch({ type: actionType.REMOVE_COMMENT, cid });
      dispatch({ type: actionType.COUNT_COMMENT, commentCount: -1 });
    })
  }
}

// ------------------------------------- LISTENER COMMENTS -----------------------------------------



// ------------------------------------- ERROR  -----------------------------------------
export function setError(error) {
  return function(dispatch){
    dispatch({type: "UPDATE_ERROR", error})
  };
}
// ------------------------------------- ERROR  -----------------------------------------


// ------------------------------------- ERROR  -----------------------------------------
export function testCounter(nr) {
  return function(dispatch){
    dispatch({type: "TEST_COUNTER", nr})
  };
}
// ------------------------------------- ERROR  -----------------------------------------
