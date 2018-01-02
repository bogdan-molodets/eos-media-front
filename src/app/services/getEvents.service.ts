import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class getEventsService {

constructor(private httpClient: HttpClient) { }

/**public get(url: string): Observable<any>{
    return this.httpClient.get(url);
}**/

}

/**this.getEvent.get('https://eos-eventservice.herokuapp.com/events/').subscibe(value =>{
    console.log(value);
},
error => {
    console.log(error);
});**/