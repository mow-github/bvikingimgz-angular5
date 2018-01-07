import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import {NgRedux, select} from 'ng2-redux';
import * as action from "../actions/actions";
import {IAppState} from "../reducers/initialState";

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ImagesComponent implements OnInit {

  imagesFiltered = null;
  imagesFilteredFlag = true;

  @Output() addRandomImageEmit: EventEmitter<undefined> = new EventEmitter();
  @Output() removeImageEmit: EventEmitter<any> = new EventEmitter();
  @Output() incrementLikeEmit: EventEmitter<any> = new EventEmitter();
  @Output() decrementLikeEmit: EventEmitter<any> = new EventEmitter();
  @Output() updateImageModalEmit: EventEmitter<any> = new EventEmitter();

  @select() images: Observable<any>;
  @select(state => {
    return state.users.uid;
  } ) usersUid: Observable<string>;
  @select(state => JSON.stringify(state.users) ) users_stringified: Observable<any>;
  @select(state => JSON.stringify(state.images) ) images_stringified: Observable<any>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) { }

  ngOnInit() {

  }



  SwitchImageViewEmitFn(event){

    const users = JSON.parse(event.target.attributes['users_stringified'].value);
    const imagesAll = JSON.parse(event.target.attributes['images_stringified'].value);

    if(!users.images){
      return this.ngRedux.dispatch<any>(action.setError(`ID ${this.randomNumberFn()} Note: Unable to use SwitchImageView atm - make sure that you have unique images 1st`));
    }

    const imageKeys = Object.keys(users.images);

    if(imageKeys.length === imagesAll.length){
      return this.ngRedux.dispatch<any>(action.setError(`ID ${this.randomNumberFn()} Note: Unable to use SwitchImageView atm - No difference all vs user images... abort`));
    }

    let userImages = Object.keys(imagesAll)
      .filter((imagePos) => imageKeys.includes( imagesAll[imagePos].imgid) ? imagePos : null )
      .map((imagePos) => imagesAll[imagePos]);

    this.imagesFilteredFlag ? this.imagesFiltered = userImages : this.imagesFiltered = null;
    this.imagesFilteredFlag = !this.imagesFilteredFlag;
  }

  addRandomImageEmitFn(){
    this.addRandomImageEmit.emit();
  }

  removeImageEmitFn(image, event){
    const users = JSON.parse(event.target.attributes['users_stringified'].value);
    image.current_user_role = users.role;
    this.removeImageEmit.emit(image);
  }

  incrementLikeEmitFn(imgid){
    this.incrementLikeEmit.emit(imgid);
  }

  decrementLikeEmitFn(imgid){
    this.decrementLikeEmit.emit(imgid);
  }

  updateImageModalEmitFn(image){
    this.updateImageModalEmit.emit(image);
  }

  private randomNumberFn(){
    return Math.floor(Math.random()*1000)
  }
}
