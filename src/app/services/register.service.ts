import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { News } from '../news';
import { catchError } from 'rxjs/operators';
import { Register } from '../register';

@Injectable()
export class RegisterService {

  private register_url = 'https://media-test-service.herokuapp.com/user/registration/';

  constructor(private httpClient: HttpClient) {}

  register(registerData: any): Observable<any> {    
    return this.httpClient.post(this.register_url, registerData).pipe(catchError(this.handleError('register', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
