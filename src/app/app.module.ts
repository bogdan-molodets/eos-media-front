import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { HttpClientModule } from '@angular/common/http';

import { EventComponent } from './event/event.component';
import { CoverageComponent } from './coverage/coverage.component';
import { CardComponent } from './card/card.component';
import { HeaderComponent } from './header/header.component';
import { MapBoxComponent } from './map-box/map-box.component';

import {EventsService} from './services/events.service';
import {MapService} from './services/map.service';
import {AngularOpenlayersModule} from 'ngx-openlayers';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    EventComponent,
    CoverageComponent,
    CardComponent,
    HeaderComponent,
    MapBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularOpenlayersModule
  ],
  providers: [ EventsService, MapService ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
