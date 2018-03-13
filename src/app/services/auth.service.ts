import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { News } from '../news';
import { catchError } from 'rxjs/operators';
import { Register } from '../register';



@Injectable()
export class AuthService {

  // private register_url = 'https://media-test-service.herokuapp.com/user/registration/';

  private token_url = 'https://auth.eos.com/api/v1/user/token/';
  private details_url = 'https://auth.eos.com/api/v1/user/details/';
  private is_authenticated_url = 'https://auth.eos.com/api/v1/user/is_authenticated/';
  private logout_url = 'https://auth.eos.com/api/v1/user/logout/';

  constructor(private httpClient: HttpClient) { }
token:any;
  // register(registerData: any): Observable<any> {
  //   return this.httpClient.post(this.register_url, registerData).pipe(catchError(this.handleError('register', [])));
  // }
  getToken() {
    return this.httpClient.get(this.token_url,{withCredentials:true}).pipe(catchError(this.handleError('getToken', [])));
  }

  logout():Observable<any>{
    return this.httpClient.post(this.logout_url, {withCredentials:true}).pipe(catchError(this.handleError('logout', [])));
  }

  getDetails():Observable<any>{
    return this.httpClient.get(this.details_url).pipe(catchError(this.handleError('getDetails', [])));
  }

  isAuthenticated():Observable<any>{
    return this.httpClient.get(this.is_authenticated_url).pipe(catchError(this.handleError('isAuthenticated', [])));  
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
