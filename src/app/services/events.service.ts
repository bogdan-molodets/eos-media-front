import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, map, tap} from 'rxjs/operators';

import {Event} from '../event';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class EventsService {
  private url = 'https://media-test-service.herokuapp.com/events/';

  constructor(private httpClient: HttpClient) {
  }

  getEvents(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.url).pipe(catchError(this.handleError('getEvents', [])));
  }

  getEvent(id: number): Observable<Event> {
    const url_one = `${this.url}${id}/`;
    return this.httpClient.get<Event>(url_one)
    .pipe(
        catchError(this.handleError<Event>(`getEvent id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
