import {Injectable} from '@angular/core';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {catchError} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Tweet} from '../tweet';
import {Event} from '../event';
import {EventPages} from '../event-pages';
import {Type} from '../type';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class EventsService {
  private url = 'https://media-test-service.herokuapp.com/events/';
  private tweets_url = 'https://gruz-test-blog.herokuapp.com/api/tweet_view/';
  private types_url = 'https://media-test-service.herokuapp.com/event-types/';
  private filters_url='http://media-test-service.herokuapp.com/events/many_filter/';
  private eventsSource = new BehaviorSubject<EventPages[]>(null);
  currentEvents = this.eventsSource.asObservable();

  /*
    stateFire = new BehaviorSubject<boolean>(true);
    currentFire = this.stateFire.asObservable();
    stateFlood = new BehaviorSubject<boolean>(true);
    currentFlood = this.stateFlood.asObservable();*/
  constructor(private httpClient: HttpClient) {
  }

  /**changeStatesta(state:boolean):Observable<boolean>{
    return (!state)<boolean>;
  }**/
  getEventTypes(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(this.types_url).pipe(catchError(this.handleError('getEventTypes', [])));
  }

  getEventsByDate(from: any, to: any): Observable<Event[]> {
    let date_url = this.url + from + '/' + to + '/';
    return this.httpClient.get<Event[]>(date_url).map(res => {
      return res['results'];
    }).pipe(catchError(this.handleError('getEventsByDate', [])));
  }

  getEvents(): Observable<Event[]> {
    return this.httpClient.get(this.url).map(res => {
      return res['results'];
    }).pipe(catchError(this.handleError('getEvents', [])));
  }

  makeObserv(ep: EventPages[]): void {
    this.eventsSource.next(ep);
  }

  getEvent(id: number): Observable<Event> {
    const url_one = `${this.url}${id}/`;
    return this.httpClient.get<Event>(url_one)
    .pipe(
        catchError(this.handleError<Event>(`getEvent id=${id}`))
    );
  }

  getEventByName(name: string): Observable<Event[]> {
    const url_name = `${this.url}title/${name}/`;
    return this.httpClient.get<Event[]>(url_name).map(res => {
      return res['results'];
    }).pipe(
        catchError(this.handleError<Event[]>(`getEventByName name=${name}`))
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
  getEventsByFilters(title:string,place:string,types:string,start_date:string,end_date:string ):Observable<Event[]>{
   
    const url_filter = `${this.filters_url}${title}/${place}/${types}/${start_date}/${end_date}`;
    console.log(url_filter);
    return this.httpClient.get<Event[]>(url_filter).map(res => {
      return res['results'];
    }).pipe(
        catchError(this.handleError<Event[]>(`getEventsByFilters name=${name}`))
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
