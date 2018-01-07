import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../reducers/initialState';
import * as action from '../actions/actions';
import {Observable} from 'rxjs/Observable';

import {Router} from "@angular/router";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DefaultComponent implements OnInit {
  @select(state => state.counters.comments) counters: Observable<any>;

  constructor(
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
  ) {

  }

  ngOnInit() {

  }

  incrementCounter(){
    this.ngRedux.dispatch<any>(action.testCounter(1 ));
  }



}


