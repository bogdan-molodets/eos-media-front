import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AuthorizationComponent} from './authorization/authorization.component';
import {HttpClientModule} from '@angular/common/http';
// import { MapComponent } from './map/map.component';

import {EventComponent} from './event/event.component';
import {CoverageComponent} from './coverage/coverage.component';
import {CardComponent} from './card/card.component';
import {HeaderComponent} from './header/header.component';

import {getEventsService} from './services/getEvents.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    //MapComponent,
    EventComponent,
    CoverageComponent,
    CardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
