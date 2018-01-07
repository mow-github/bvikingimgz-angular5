import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { select } from 'ng2-redux';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  @Output() showModalLoginEmit: EventEmitter<boolean> = new EventEmitter();
  @Output() signOutEmit: EventEmitter<undefined> = new EventEmitter();

  @select(state => state.users.email) usersEmail: Observable<string>;

  constructor() { }

  ngOnInit() {
  }

  showModalLoginEmitFn() {
    this.showModalLoginEmit.emit(true);
  }

  signOutEmitFn(){
    this.signOutEmit.emit();
  }

}
