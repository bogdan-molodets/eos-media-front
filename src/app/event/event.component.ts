import { Component, OnInit, Input, HostListener } from '@angular/core';
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

  events: Event[] = [];
  event: Event;
  isEmpty = false;
  today = new Date().toJSON().split('T')[0];
  event_types: string[];
  active_types: string[];
  checked_search = false;
  next_page = 'https://media-test-service.herokuapp.com/events/?page=1';
  visible = false;
  title = '';




  /**flood: boolean = false;
   fire: boolean = false;**/
  constructor(private mapService: MapService, private eventService: EventsService, private tweetService: TweetService) {
  }

  @HostListener('scroll', ['$event'])
  onScroll(e) {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight;
    //console.log(bottom);
    if (bottom === 0 && this.next_page !== null) {
      //console.log("end of block"); if (filter === true) ? this.getEventsByFilters() : this.getEvents();
      this.getEvents(this.next_page);

    }
  }

  ngOnInit(): void {
    this.getEvents(this.next_page);
    this.getEventTypes();

  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      //make deep copy of event_types for storing checced ones
      this.active_types = this.event_types.slice();

    });
  }

  getEvents(url): void {
    this.eventService.getEvents(url).subscribe(eventpages => {
      try {

        this.events = this.events.concat(eventpages['results']);
        this.mapService.OnFilter(this.events);
        this.next_page = eventpages['next'];
        if (!eventpages['previous']) {
          this.mapService.MakeActive(this.events[0]);
        }

      } catch (err) {
        console.log(err);
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

  setVisible() {
    this.visible = !this.visible;
    if (this.visible === true) {
      document.querySelector('.target').scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  viewChanges(event) {
    this.active_types = event;
    this.setVisible();
    //call filtering on filter icon click
    this.getEventsByFilters();

  }
  viewTitle(event) {
    this.title = event;
    this.setVisible();
    //call filtering on Enter click
    this.getEventsByFilters();

  }

  /**
   * called on click or search. Check and retrieve parameters before passing to filter. Multiple filtrations
   *
   */
  getEventsByFilters(): void {
    // if types empty assign 'none', else make a string
    const types_str = this.active_types.length !== 0 ? this.active_types.join('&') : 'none';
    const t = (this.title === '') ? 'all' : this.title;

    // const sd = (start_date === '') ? 'all' : start_date;
    // const ed = (end_date === '') ? 'all' : end_date;
    this.eventService.getEventsByFilters(t, 'all', types_str, 'all', 'all').subscribe(events => {
      this.events = events['results'];
      this.next_page = events['next'];
      this.mapService.OnFilter(this.events);
      if (this.events.length > 0) {
        this.mapService.MakeActive(this.events[0]);
      } else {
        this.mapService.MakeActive(null);
      }

    });
  }












  /* getEventByDate(from: any, to: any): void {
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


   }*/

  /**
   * trow ex if start date more then end date
   * @param from start date
   * @param to end date
   */
  /*checkDate(from: any, to: any): any {
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
      this.eventService.getEvents(this.next_page).subscribe(events => {

        this.events = events['results'];
        if (this.events) {

          this.mapService.OnFilter(this.events);
        }

      });
    }
    // if not undefined filter markers


  }
*/




}
