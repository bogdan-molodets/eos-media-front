import {Component, OnInit, Input} from '@angular/core';
// import {Events} from '../mock-events';
import {Event} from '../event';
import {EventsService} from '../services/events.service';

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {

  // @Input() events;
  events: Event[];
  event: Event;

  constructor(private eventService: EventsService) {
  }
 
  getEvents(): void {
    this.eventService.getEvents().subscribe(events => this.events = events);
  }

  ngOnInit(): void {
    this.getEvents();
   // console.log(this.getEvent());
  }

  getEvent(): void {
    // надо получить айди по клику ты говорил, что знаешь
    const id = 4;
    this.eventService.getEvent(id).subscribe(event => this.event = event);
  }

}
