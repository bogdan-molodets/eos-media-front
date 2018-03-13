import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TweetService {
  private url = 'https://media-test-service.herokuapp.com/tweets';
  private twitter_event_url = 'https://media-test-service.herokuapp.com/tweets/event/';
  private twit_ids= 'https://media-test-service.herokuapp.com/tweets/event/';

  constructor(private httpClient: HttpClient) {
  }
  /**
   * get tweets(id, real_id, ...) by event id
   * @param id event id
   */
  getTweetsIdsByEventId(id: number, next_page: string): Observable<any> {
    let url;
    if (next_page !== null) {
      url = next_page;
    }else {
      url = this.twit_ids + id;
    }
    return this.httpClient.get<any>(url).pipe(catchError(this.handleError('getTweetsIdsByEventId', [])));
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





}
