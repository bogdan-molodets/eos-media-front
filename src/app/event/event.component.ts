import {Component, OnInit, Input} from '@angular/core';
// import {Events} from '../mock-events';
import {Event} from '../event';
import {getEventsService} from '../services/getEvents.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {
  private url = 'https://media-test-service.herokuapp.com/events/';
  @Input() events;
  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get<Event>(this.url).subscribe(value => {

          this.events = value;
        },
        err => {
          console.log('error');
        });

  }

}
