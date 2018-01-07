import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../reducers/initialState';
import * as action from '../actions/actions';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';

import faker from 'faker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router:Router,
    private ngRedux: NgRedux<IAppState>,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) {
    this.registerForm = fb.group({
      email: new FormControl('a@a.se', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('123456', [
        Validators.required,
        Validators.minLength(3),
      ]),
      name: new FormControl('a name', [
        Validators.required,
        Validators.minLength(3),
      ]),
      role: new FormControl('admin', [
        Validators.required,
      ])
    });
  }

  ngOnInit() {

  }

  onSubmitRegisterForm() {
    const { email, password, name, role } = this.registerForm.value;
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const newUser = { name, email, role, uid: user.uid };
        console.log(newUser);
        firebase.database().ref(`users/${user.uid}`).set(newUser);
      })
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch(error => {
        this.registerForm.controls['role'].setErrors({backend: error.message});
        this.ngRedux.dispatch<any>(action.setError(error.message));
      })
  }

  registerOAuth = (provider) => {
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
      .then((authData) => {
        const { user, additionalUserInfo } = authData;

        const newUser = {
          name: additionalUserInfo.profile.name,
          email: additionalUserInfo.profile.email,
          role: "subscriber",
        };
        firebase.database().ref(`users/${user.uid}`).set(newUser);
      })
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch(error => {
        this.ngRedux.dispatch<any>(action.setError(error.message));
      })
  };


}

