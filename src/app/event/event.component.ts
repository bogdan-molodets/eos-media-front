import { Component, OnInit, Input } from '@angular/core';
// import {Events} from '../mock-events';
import { Event } from '../event';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {
  events: Event[];
  event: Event;
  isEmpty: boolean = false;
  today = new Date().toJSON().split('T')[0];
  event_types: string[];

  /**flood: boolean = false;
   fire: boolean = false;**/
  constructor(private mapService: MapService, private eventService: EventsService) {
  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      console.log(this.event_types)
    })
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(eventpages => {
      try {
        this.events = eventpages;
        this.mapService.MakeActive(this.events[0]);
      } catch (err) {
      }
    });
  }

  getEventByDate(from: any, to: any): void {
    console.log(`from: ${from}`);
    console.log(`to: ${to}`);
       
        if(from == ''){from = null;}
        if(to == ''){to = null}
        console.log(from);
        if ((from != null) && (to != null) && from > to) {
          alert(`error`);        
        }else{
          this.eventService.getEventsByDate(from, to).subscribe(events => {
            this.events = events;
            this.mapService.OnFilter(this.events);
          });
        }
        
      
  }

  getEventByType(event_types: string[]): void {
    console.log(event_types);
  }

  /**getEventByName(name:string): void{
     if(name.length!=0){
        this.eventService.getEventByName(name).subscribe(events => {this.events = events; });
     }else{
        //this.eventService.getEvents().subscribe(events => {this.events = events;});
        this.eventService.getEvents().subscribe(eventpages => {try{this.events = eventpages['results']}catch(err){}});
      }
    });}**/




  getEventByName(name: string): void {
    if (name.length != 0) {
      this.eventService.getEventByName(name).subscribe(events => {
        this.events = events;
        if (this.events) {

          this.mapService.OnFilter(this.events);
        }
      });
    } else {
      //this.eventService.getEvents().subscribe(events => {this.events = events;});
      this.eventService.getEvents().subscribe(events => {

        this.events = events;
        if (this.events) {

          this.mapService.OnFilter(this.events);
        }

      });
    }
    // if not undefined filter markers


  }

  ngOnInit(): void {
    this.getEvents();
    this.getEventTypes();
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
