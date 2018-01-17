import {Component, OnInit, Input} from '@angular/core';
// import {Events} from '../mock-events';
import {Event} from '../event';
import {EventsService} from '../services/events.service';

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {
  events: Event[];
  event: Event;
  isEmpty: boolean = false;
  /**flood: boolean = false;
  fire: boolean = false;**/
  constructor(private eventService: EventsService) {
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(eventpages => {try{this.events = eventpages['results']}catch(err){}});
  }

  getEventByName(name:string): void{
     if(name.length!=0){
        this.eventService.getEventByName(name).subscribe(events => {this.events = events; });
     }else{
        //this.eventService.getEvents().subscribe(events => {this.events = events;});
        this.eventService.getEvents().subscribe(eventpages => {try{this.events = eventpages['results']}catch(err){}});
      }
  }
  
  ngOnInit(): void {
    this.getEvents();
    /** this.eventService.currentFlood.subscribe(flood => this.flood = flood);
     this.eventService.currentFire.subscribe(fire => this.fire = fire);**/
    // console.log(this.getEvent());
  }

  getEvent(): void {
    // надо получить айди по клику ты говорил, что знаешь
    const id = 4;
    this.eventService.getEvent(id).subscribe(event => this.event = event);
  }

}
