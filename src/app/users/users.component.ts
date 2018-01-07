import { Component, OnInit } from '@angular/core';
import * as action from "../actions/actions";
import {IAppState} from "../reducers/initialState";
import {NgRedux, select} from "ng2-redux";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @select(state => state.usersall ) usersall: Observable<string>;
  @select(state => state.users.email ) current_user_email: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
  ) { }

  ngOnInit() {
    this.ngRedux.dispatch<any>(action.getAllUsers());
  }

  updateUserRoleFn(user){
    this.ngRedux.dispatch<any>(action.updateUserRole(user));
  }

}
