import {Component, ViewEncapsulation, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {select} from 'ng2-redux';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit {
  @Input()
  @select(state => state.errors) error: Observable<any>;

  public alerts: Array<IAlert> = [];

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const message: string = this.route.snapshot.data['notFoundError'];

    if (message) {
      this.alerts.push(
        {
          id: 1,
          type: 'warning',
          message,
        }
      );
    }

    this.error.subscribe((msg) => {

      if(msg.length > 1){

        this.alerts.push(
          {
            id: 1,
            type: 'danger',
            message: msg,
          },
        );
      }


    });

  }

  public closeAlert() {
    this.alerts = [];
  }

}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}
