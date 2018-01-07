import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {select} from 'ng2-redux';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @select(state => state.counters.images) imagesCounter: Observable<number>;
  @select(state => state.counters.users) usersCounter: Observable<number>;
  @select(state => state.counters.comments) commentsCounter: Observable<number>;

  constructor() { }

  ngOnInit() {
  }

}
