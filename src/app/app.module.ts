import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { NgRedux, NgReduxModule, DevToolsExtension } from 'ng2-redux';
import reduxLogger from 'redux-logger';
import thunk from  'redux-thunk';
import { rootReducer } from './store';
import { IAppState, INITIAL_STATE } from './reducers/initialState';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorComponent } from './error/error.component';
import { DefaultComponent } from './default/default.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DefaultComponent
  },
  {
    path: '**',
    component: ErrorComponent,
    data: { notFoundError: 'Unable to find this page' }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    DefaultComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgReduxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Dependency injection: let the constructor init redux
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension,
  ) {
    let enhancers = [];

    if (isDevMode && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }

    ngRedux.configureStore(rootReducer, INITIAL_STATE, [reduxLogger,thunk], enhancers);
  }
}
