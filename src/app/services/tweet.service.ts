import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Tweet } from '../tweet';
import { Tweets } from '../tweets';
import { TweetsPages } from '../tweets-pages';
import { TwitterResponse } from '../twitter-response';
import { Event } from '../event';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TweetService {
  private url = 'https://media-test-service.herokuapp.com/tweets';
  //
  private twitter_url = 'https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/';
  private twitter_event_url = 'https://media-test-service.herokuapp.com/tweets/event/';
  readonly TWITTER_SCRIPT_ID = 'twitter-wjs';
  readonly TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

 // private tweet_page: any;

  private twit_ids= 'https://media-test-service.herokuapp.com/tweets/single/';
  private twit_by_id= 'https://media-test-service.herokuapp.com/tweets/html/';
  constructor(private httpClient: HttpClient) {
  }


  // OnCardClick(event: Event) {
  //   this.getTweetsByEventId(event['id']).subscribe(
  //     result => {
  //       this.tweet_page = result;
  //       console.log(this.tweet_page);
  //     }
  //   );
  // }



  /**
   * get tweets(id, real_id, ...) by event id
   * @param id event id
   */
  getTweetsIdsByEventId(id: number): Observable<Tweets[]>{
    return this.httpClient.get<Tweets[]>(this.twit_ids + id).map(res => res['results']).pipe(catchError(this.handleError('getTweetsIdsByEventId', [])));
  }

  /**
   * get tweets by real id
   * @param id reail tweet id
   */
  getTweetsByTweetRealId(id: string): Observable<any> {
    return this.httpClient.get<any>(this.twit_by_id + id).pipe(catchError(this.handleError('getTweetsByTweetRealId', [])));
  }

  /**
   * get tweets by event pk
   * @param id event pk
   */
  getTweetsByEventId(id: number): Observable<any> {
    return this.httpClient.get<any>(this.twitter_event_url + id).pipe(catchError(this.handleError('getTweetsByEventId', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  LoadScript(): Observable<any> {
    const that = this;

    return Observable.create(observer => {
      // START LOADING SCRIPT INTO DOM
      that.startScriptLoad();

      // WHEN TWITTER WIDGETS SCRIPT IS LOADED, THEN PASS ALONG....

      if (window['twttr']) {
        observer.next(window['twttr']);
      } else {
        observer.of(null);
      }
    });
  }

  startScriptLoad() {
    (<any>window).twttr = (function (d, s, id) {
      let js: any, fjs = d.getElementsByTagName(s)[0],
        t = (<any>window).twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://platform.twitter.com/widgets.js';
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f: any) {
        t._e.push(f);
      };

      return t;
    }(document, 'script', 'twitter-wjs'));
  }
}
