import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { EventComponent } from './event/event.component';
import { CoverageComponent } from './coverage/coverage.component';
import { CardComponent } from './card/card.component';
import { HeaderComponent } from './header/header.component';
import { MapBoxComponent } from './map-box/map-box.component';
import { TweetComponent } from './tweet/tweet.component';
import { AdminComponent } from './admin/admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClientComponent } from './client/client.component';
import { AuthComponent } from './auth/auth.component';
import { FilterComponent } from './filter/filter.component';
import { NewsComponent } from './news/news.component';
import { PhotosComponent } from './photos/photos.component';
import { MobileComponent } from './mobile/mobile.component';

import { EventsService } from './services/events.service';
import { MapService } from './services/map.service';
import { TweetService } from './services/tweet.service';
import { NewsService } from './services/news.service';
import { PhotosService } from './services/photos.service';
import { AuthService } from './services/auth.service';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

import { CompareComponent } from './compare/compare.component';
import { TokenInterceptor } from './auth/token.interceptor';
//import { OAuthService, OAuthModule, UrlHelperService } from 'angular-oauth2-oidc';


import { RegComponent } from './reg/reg.component';


// import {AngularOpenlayersModule} from 'ngx-openlayers';

const appRoutes: Routes = [

  { path: '', redirectTo: 'event', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'reg', component: RegComponent },
  {
    path: 'event', component: ClientComponent, children: [
      { path: '', component: EventComponent, outlet: 'event' },
      { path: '', component: CoverageComponent, outlet: 'coverage' },
      { path: '', component: MapBoxComponent, outlet: 'map' },
      { path: 'compare', children: [] },
      { path: 'not-found', component: PageNotFoundComponent, outlet: 'error' }
    ]
  },
  { path: '**', component: PageNotFoundComponent }];


@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    CoverageComponent,
    CardComponent,
    HeaderComponent,
    MapBoxComponent,
    TweetComponent,
    AdminComponent,
    PageNotFoundComponent,
    ClientComponent,
    AuthComponent,
    FilterComponent,
    NewsComponent,
    PhotosComponent,
    MobileComponent,
    CompareComponent,
    RegComponent,

  ],
  imports: [
    HttpClientXsrfModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
   // OAuthModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, useHash: true
      } // <-- debugging purposes only
    ),
    NgxCarouselModule
    // AngularOpenlayersModule
  ],
  providers: [EventsService, MapService, TweetService, NewsService, PhotosService, AuthService,
  {
    provide:HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi:true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
