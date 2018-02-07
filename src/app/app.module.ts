import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
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
import { AdminComponent } from './admin/admin.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { ClientComponent } from './client/client.component';
import { AuthComponent } from './auth/auth.component';
import { FilterComponent } from './filter/filter.component';
import { NewsComponent } from './news/news.component';
import { NewsService } from './services/news.service';
import { PhotosComponent } from './photos/photos.component';
import { SafePipe } from './safe.pipe';
// import {AngularOpenlayersModule} from 'ngx-openlayers';

const appRoutes: Routes = [  
  {path: 'admin', component: AdminComponent},
  {path: 'auth', component: AuthComponent},
  {path: '', component: ClientComponent},
  {path: '**', component: PageNotFoundComponent}  
]

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    CoverageComponent,
    CardComponent,
    HeaderComponent,
    MapBoxComponent,
    TweetComponent,
    ModalComponent,
    AdminComponent,
    PageNotFoundComponent,
    ClientComponent,
    AuthComponent,
    FilterComponent,
    NewsComponent,
    PhotosComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
   // AngularOpenlayersModule
  ],
  providers: [ EventsService, MapService, TweetService,NewsService ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
