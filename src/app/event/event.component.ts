import { Component, OnInit, Input } from '@angular/core';
// import {Events} from '../mock-events';
import { Event } from '../event';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { TweetService } from '../services/tweet.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Type } from '../type';

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {

  events: Event[];
  event: Event;
  isEmpty = false;
  today = new Date().toJSON().split('T')[0];
  event_types: string[];
  active_types: string[];
  checked_search: boolean = false;
  
  visible: boolean = false;
  title: string = '';




  /**flood: boolean = false;
   fire: boolean = false;**/
  constructor(private mapService: MapService, private eventService: EventsService, private tweetService: TweetService) {
  }


  ngOnInit(): void {
    this.getEvents();
    this.getEventTypes();
   
  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      //make deep copy of event_types for storing checced ones
      this.active_types = this.event_types.slice();

    });
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

 /**
   * add to array checked types and remove unchecked
   * @param e event occured oncheckbox click
   * @param name name of event type
   */
  CheckType(e: any, name: string): void {

    if (e.target.checked) {
      this.active_types.push(name);
    } else {
      this.active_types.splice(this.active_types.indexOf(name), 1);
    }

  }   

  setVisible(){
    this.visible = !this.visible;
  }

  viewChanges(event){
    this.active_types = event;
    
  }
  viewTitle(event){
    this.title = event;
    this.setVisible();
    //call filtering on Find click
    this.getEventsByFilters();
   
  }

  /**
   * called on click or search. Check and retrieve parameters before passing to filter. Multiple filtrations
   *
   */
  getEventsByFilters(): void {
    // if types empty assign 'none', else make a string
    const types_str = this.active_types.length !== 0 ? this.active_types.join('&') : 'none';    
    const t=(this.title === '') ? 'all' : this.title;   
    
    // const sd = (start_date === '') ? 'all' : start_date;
    // const ed = (end_date === '') ? 'all' : end_date;
    this.eventService.getEventsByFilters(t, 'all', types_str, 'all', 'all').subscribe(events => {
      this.events = events;
      this.mapService.OnFilter(this.events);
      if (this.events.length > 0) {        
        this.mapService.MakeActive(this.events[0]);
      } else {
        this.mapService.MakeActive(null);
      }

    });
  }





  
  
  
  
  
  
  
  getEventByDate(from: any, to: any): void {
    console.log(`from: ${from}`);
    console.log(`to: ${to}`);

    if (from === '') { from = null; }
    if (to === '') { to = null; }
    console.log(from);
    if ((from != null) && (to != null) && from > to) {
      alert(`error`);
    } else {
      this.eventService.getEventsByDate(from, to).subscribe(events => {
        this.events = events;
        this.mapService.OnFilter(this.events);
      });
    }


  } 

  /**
   * trow ex if start date more then end date
   * @param from start date
   * @param to end date
   */
  checkDate(from: any, to: any): any {
    if (from === '') { from = null; }
    if (to === '') { to = null; }
    if ((from != null) && (to != null) && from > to) {
      throw new Error('Start date must be less then end');
    }
  }
  getEventByName(name: string): void {
    if (name.length !== 0) {
      this.eventService.getEventByName(name).subscribe(events => {
        this.events = events;
        if (this.events) {

          this.mapService.OnFilter(this.events);
        }
      });
    } else {
      // this.eventService.getEvents().subscribe(events => {this.events = events;});
      this.eventService.getEvents().subscribe(events => {

        this.events = events;
        if (this.events) {

          this.mapService.OnFilter(this.events);
        }

      });
    }
    // if not undefined filter markers


  }

 

  
  
}
