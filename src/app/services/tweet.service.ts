import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Tweet} from '../tweet';
import {Tweets} from '../tweets';
import {TweetsPages} from '../tweets-pages';
import {TwitterResponse} from '../twitter-response';
import {Event} from '../event';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  @Injectable()
export class TweetService {
    private url = 'https://media-test-service.herokuapp.com/tweets';
    // 
    private twitter_url = 'https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/';
    private twitter_event_url = 'https://media-test-service.herokuapp.com/tweets/event/'
    readonly TWITTER_SCRIPT_ID = 'twitter-wjs';
    readonly TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';

   private tweet_page: any;

    constructor(private httpClient: HttpClient) {
    }

    LoadScript() : Observable<any>{
        let that = this;

        return Observable.create(observer =>{
      //START LOADING SCRIPT INTO DOM
      that.startScriptLoad();

      //WHEN TWITTER WIDGETS SCRIPT IS LOADED, THEN PASS ALONG....
      that.twttr.ready(
        function onLoadTwitterScript(twttr){
            //console.log('Twitter Load Successful');
            observer.next(twttr);
            observer.complete();
        }
      );

    });
  };

  OnCardClick(event: Event){
    this.getTweetsByEventId(event['id']).subscribe(
      result =>{
        this.tweet_page = result
      }
    );
  }

  private startScriptLoad() 
  {
    this.twttr = (function(d, s, id, url) 
    {
        var js, 
        fjs = d.getElementsByTagName(s)[0],
        t = window['twttr'] || {};

        if (d.getElementById(id)) return t;

        js = d.createElement(s);
        js.id = id;
        js.src = url;
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];

      t.ready = function(f) 
      {
            t._e.push(f);
      };

        return t;
    }(document, "script", this.TWITTER_SCRIPT_ID, this.TWITTER_WIDGET_URL));
  }   

  private twttr = {
    _e:[],
     ready: function(f){this._e.push(f)}
  }

    getTweets(): Observable<Tweets[]> {
        return this.httpClient.get<Tweets[]>(this.url).map(res =>{return res['results']}).pipe(catchError(this.handleError('getTweets', [])));
    }

    getTweetsById(id:string): Observable<any>{
        return this.httpClient.get<any>(this.twitter_url + id ).map(res =>{
          console.log(res);
          return res['html']}).pipe(catchError(this.handleError('getTweetsById', [])));
    }

    getTweetsByEventId(id:number): Observable<any>{
        return this.httpClient.get<any>(this.twitter_event_url + id ).pipe(catchError(this.handleError('getTweetsByEventId', [])));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.error(error);
    
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
}