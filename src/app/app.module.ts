import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { HttpClientModule } from '@angular/common/http';

import { EventComponent } from './event/event.component';
import { CoverageComponent } from './coverage/coverage.component';
import { CardComponent } from './card/card.component';
import { HeaderComponent } from './header/header.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { TweetComponent } from './tweet/tweet.component';

import {EventsService} from './services/events.service';
import {MapService } from './services/map.service';
import {TweetService} from './services/tweet.service';
import { ModalComponent } from './modal/modal.component';
// import {AngularOpenlayersModule} from 'ngx-openlayers';


@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    EventComponent,
    CoverageComponent,
    CardComponent,
    HeaderComponent,
    MapBoxComponent,
    TweetComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
   // AngularOpenlayersModule
  ],
  providers: [ EventsService, MapService, TweetService ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
