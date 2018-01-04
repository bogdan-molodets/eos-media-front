import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

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
    return this.httpClient.get<Event[]>(this.url);
  }
}
