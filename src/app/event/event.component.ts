import { Component, OnInit, Input } from '@angular/core';
import { Events } from '../mock-events';
import { Event } from '../event';
import { getEventsService} from '../services/getEvents.service'
import { HttpClient } from '@angular/common/http';

@Component({
  	selector: 'app-event',
  	templateUrl: './event.component.html',
  	styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {
	@Input() events = Events;
  	constructor() { }

  	ngOnInit() {
  		let httpClient:HttpClient;
  		let getEvents = new getEventsService(httpClient);
  		//let result:any = getEvents.get('https://eos-eventservice.herokuapp.com/events/');
  	}

}
