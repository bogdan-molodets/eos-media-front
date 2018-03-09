import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { News } from '../news';
import { catchError } from 'rxjs/operators';
import { Photo } from '../photo';

@Injectable()
export class PhotosService {


  private photos_event_url= 'https://media-test-service.herokuapp.com/photos/event/';
  constructor(private httpClient: HttpClient) { }

  /**
   * get photos for event
   * @param id event pk
   */
  getPhotosByEventId(id: number): Observable<Photo[]> {
    return this.httpClient.get<any>(this.photos_event_url + id).pipe(catchError(this.handleError('getPhotosByEventId', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
