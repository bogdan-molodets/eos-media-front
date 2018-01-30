import { Component, OnInit, Input } from '@angular/core';
// import {Events} from '../mock-events';
import { Event } from '../event';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { TweetService } from '../services/tweet.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Type } from '../type';

@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {

  events: Event[];
  event: Event;
  isEmpty: boolean = false;
  today = new Date().toJSON().split('T')[0];
  event_types: string[];
  checked_event_types: string[];
  checked_search: boolean = false;
  error_message = '24234';
  is_error = false;//'Error date input.'




  /**flood: boolean = false;
   fire: boolean = false;**/
  constructor(private mapService: MapService, private eventService: EventsService, private tweetService: TweetService) {
  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      //make deep copy of event_types for storing checced ones
      this.checked_event_types = this.event_types.slice();

    })
  }

  // GetEventTypes():string[]{
  //   return this.event_types
  // }

  getEvents(): void {
    this.eventService.getEvents().subscribe(eventpages => {
      try {
        this.events = eventpages;
        this.mapService.MakeActive(this.events[0]);
        this.tweetService.getTweetsByEventId(this.events[0]['id']);
      } catch (err) {
      }
    });
  }

  getEventByDate(from: any, to: any): void {
    console.log(`from: ${from}`);
    console.log(`to: ${to}`);

    if (from == '') { from = null; }
    if (to == '') { to = null }
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
   * add to array checked types and remove unchecked
   * @param e event occured oncheckbox click
   * @param name name of event type
   */
  CheckType(e: any, name: string): void {

    if (e.target.checked) {
      this.checked_event_types.push(name);
    } else {
      this.checked_event_types.splice(this.checked_event_types.indexOf(name), 1);
    }

  }

  getEventByType(event_types: string[]): void {
    console.log(event_types);
  }

  /**
   * called on click or search. Check and retrieve parameters before passing to filter. Multiple filtrations
   * @param title 
   * @param place 
   * @param start_date 
   * @param end_date 
   */
  getEventsByFilters(title: string, start_date: string, end_date: string): void {



    try {
      this.checkDate(start_date, end_date);
    }
    catch (err) {
      alert(err);
      return;
    }


    // if types empty assign 'none', else make a string
    const types_str = this.checked_event_types.length != 0 ? this.checked_event_types.join('&') : 'none';

    // if empty assign all 
    let p, t;
    if (this.checked_search) {
      console.log('checked');
      p = (title == '') ? 'all' : title;
      t = 'all';
    } else {
      t = (title == '') ? 'all' : title;
      p = 'all';
    }

    //const p = (place == '') ? 'all' : place;
    const sd = (start_date == '') ? 'all' : start_date;
    const ed = (end_date == '') ? 'all' : end_date;
    this.eventService.getEventsByFilters(t, p, types_str, sd, ed).subscribe(events => {
      this.events = events;
      if (this.events.length > 0) {
        this.mapService.OnFilter(this.events);
        this.mapService.MakeActive(this.events[0]);
        this.tweetService.getTweetsByEventId(this.events[0]['id']);
      }

    });
  }

  /**
   * trow ex if start date more then end date
   * @param from start date
   * @param to end date
   */
  checkDate(from: any, to: any): any {
    if (from == '') { from = null; }
    if (to == '') { to = null }
    if ((from != null) && (to != null) && from > to) {
      throw "Start date must be less then end";
    }
  }

  doCheck(e: any): void {
    this.checked_search = !this.checked_search;
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
