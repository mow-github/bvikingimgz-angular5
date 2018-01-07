import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../reducers/initialState';
import * as action from '../actions/actions';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';

import faker from 'faker';
import {Router} from "@angular/router";
import "rxjs/add/operator/pairwise";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DefaultComponent implements OnInit {
  @select(state => state.users) users: Observable<any>;
  @select() images: Observable<any>;
  @select(state => state.users.role ) users_role: Observable<string>;
  @select(state => {
    return state.comments
      .sort((x, y) => y.timestampRaw - x.timestampRaw)
      .filter((item) => {
        if(item.timestampRaw){
          return item.timestampRaw = new Date(item.timestampRaw).toLocaleString()
        }
      })
  }) comments: Observable<string>;
  @select(state => JSON.stringify(state.users) ) users_stringified: Observable<any>;

  toggleUser = false;

  closeResult: string;
  closeResultImage: string;

  loginForm: FormGroup;
  imageModalForm: FormGroup;
  updateImageModalObj = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private modalServiceImage: NgbModal,
    private ngRedux: NgRedux<IAppState>,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: new FormControl('a@a.se', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('123456', [
        Validators.required,
        Validators.minLength(3),
      ])
    });

    this.imageModalForm = fb.group({
      text: new FormControl('hii', [
        Validators.required,
      ]),
      imgid: new FormControl(null)
    });

  }

  ngOnInit() {
    this.afAuth.authState.subscribe((userAuth) => {
      if(userAuth){
        this.db.object(`users/${userAuth.uid}`).valueChanges().subscribe((userData) => {
          const userDataNew = {...userData, uid: userAuth.uid};
          this.ngRedux.dispatch<any>(action.userChangedIn(userDataNew));
        })
      }else{
        this.ngRedux.dispatch<any>(action.userChangedOut());
      }
    });

    this.router.events
      .filter(e => e.constructor.name === 'RoutesRecognized')
      .pairwise()
      .subscribe((e) => {
        console.log(e);
      });

    // Listeners Images
    this.ngRedux.dispatch<any>(action.postImagesListener());
    this.ngRedux.dispatch<any>(action.removeImageListener());

    // Listeners Users
    this.ngRedux.dispatch<any>(action.postUsersListener());
    this.ngRedux.dispatch<any>(action.removeUsersListener());

    // Listeners Votes
    this.ngRedux.dispatch<any>(action.postVotesListener());
    this.ngRedux.dispatch<any>(action.removeVotesListener());

    // Listeners Comments
    this.ngRedux.dispatch<any>(action.postCommentsListener());
    this.ngRedux.dispatch<any>(action.removeCommentsListener());

  }


  updateImageModal(content_image, image) {
    this.imageModalForm.patchValue({
      imgid: image.imgid,
    });
    this.updateImageModalObj = image;

    this.modalServiceImage.open(content_image).result.then((result) => {
      this.closeResultImage = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResultImage = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {

    this.ngRedux.dispatch<any>(action.clearComments());


    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmitImageModalForm() {
    const { text, imgid } = this.imageModalForm.value;
    const timestampRaw = Date.now();
    const commentObj = { timestampRaw, text, imgid };
    this.ngRedux.dispatch<any>(action.postComment(commentObj));
  }

  getComments(imgid){
    this.ngRedux.dispatch<any>(action.getComments(imgid));
  }

  removeComment(comment, event){
    const users = JSON.parse(event.target.attributes['users_stringified'].value);
    this.ngRedux.dispatch<any>(action.removeComment(comment, users.role));
  }

  toggleUpdateInputFlag = false;
  toggleUpdateInput(){
    this.toggleUpdateInputFlag = !this.toggleUpdateInputFlag;
  }

  updateComment(comment, event){
    comment.text = event.target.value;
    const users = JSON.parse(event.target.attributes['users_stringified'].value);
    this.ngRedux.dispatch<any>(action.updateComment(comment, users.role));

    console.log("----- updateComment", users.role, comment);
  }

  onSubmitLoginForm() {
    const { email, password } = this.loginForm.value;
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.loginForm.controls['password'].setErrors({backend: error.message});
        this.ngRedux.dispatch<any>(action.setError(error.message));
      })
  }

  loginOAuth = (provider) => {
    switch (provider){
      case "github":
        provider = new firebase.auth.GithubAuthProvider();
        break;
      case "twitter":
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      default:
        this.ngRedux.dispatch<any>(action.setError("error msg, invalid Oauth provider"));
        return;
    }

    this.afAuth.auth
      .signInWithPopup(provider)
      .catch(error => {
        this.ngRedux.dispatch<any>(action.setError(error.message));
      })
  };

  signOut(){
    this.afAuth.auth.signOut();
  }

  removeLoggedinUserFB() {
    this.ngRedux.dispatch<any>(action.removeLoggedinUserFB());
  }

  addRandomImage(){

    const randomNr   = Math.floor(Math.random()*1000),
      src             = `https://picsum.photos/200/200?random=${randomNr}`,
      title           = faker.lorem.words(),
      alt             = `img${randomNr}`,
      thumbs_up_tot   = 0,
      thumbs_down_tot = 0,
      comments_tot    = 0;

    const imageObj = { src, alt, title, thumbs_up_tot, thumbs_down_tot, comments_tot, };
    this.ngRedux.dispatch<any>(action.postImages(imageObj));

  }

  removeImage(image){
    this.ngRedux.dispatch<any>(action.removeImage(image, image.current_user_role));
  }

  incrementLike(imgid){
    this.ngRedux.dispatch<any>(action.postVote({imgid, value: 1} ));
  }

  decrementLike(imgid){
    this.ngRedux.dispatch<any>(action.postVote({imgid, value: -1} ));
  }

  toggleUserFn(){
    this.toggleUser = !this.toggleUser;
  }



}
