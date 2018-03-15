import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Event } from '../event';
import { Type } from '../type';
import { environment } from '../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventsService {
  private url = environment.apiUrl+'events/';
  private types_url = environment.apiUrl+'event-types/';
  private filters_url = environment.apiUrl+'events/many_filter/';
  private page_url = environment.apiUrl+'event-id/';


  constructor(private httpClient: HttpClient) {
  }


  getEventTypes(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(this.types_url).pipe(catchError(this.handleError('getEventTypes', [])));
  }


  getEvents(url: string): Observable<any> {
    return this.httpClient.get(url).pipe(catchError(this.handleError('getEvents', [])));
  }
  getEvent(id: number): Observable<Event> {
    const url_one = `${this.url}${id}/`;
    return this.httpClient.get<Event>(url_one)
      .pipe(
      catchError(this.handleError<Event>(`getEvent id=${id}`))
      );
  }


  /**
   * multiple events filtration
   * @param title name of event
   * @param place event place
   * @param types string of event types e.g. 'type1&type2&...&typeN'
   * @param start_date start event date
   * @param end_date end event date
   */
  getEventsByFilters(title: string, place: string, types: string, start_date: string, end_date: string): Observable<any> {

    const url_filter = `${this.filters_url}${title}/${place}/${types}/${start_date}/${end_date}`;   
    return this.httpClient.get(url_filter).pipe(
      catchError(this.handleError(`getEventsByFilters name=${name}`))
      );
  }


  getPageByEventId(id: number): Observable<any> {
    return this.httpClient.get(this.page_url + id).pipe(catchError(this.handleError(`getEventsByFilters name=${name}`)));
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
