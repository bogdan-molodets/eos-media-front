import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { News } from '../news';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NewsService {

  private news_url= 'https://media-test-service.herokuapp.com/news/';
  private news_event_url= 'https://media-test-service.herokuapp.com/news/event/';
  constructor(private httpClient: HttpClient) { }

  /**
   * get news for event
   * @param id event pk
   */
  getNewsByEventId(id: number): Observable<News[]>{
    return this.httpClient.get<any>(this.news_event_url + id).pipe(catchError(this.handleError('getNewsByEventId', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
