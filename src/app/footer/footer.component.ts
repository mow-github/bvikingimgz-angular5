import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { select } from 'ng2-redux';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  @Output() removeLoggedinUserFBEmit: EventEmitter<any> = new EventEmitter();

  @select(state => state.users.email) usersEmail: Observable<string>;

  currentDate: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

  removeLoggedinUserFBEmitFn() {
    this.removeLoggedinUserFBEmit.emit();
  }

}
