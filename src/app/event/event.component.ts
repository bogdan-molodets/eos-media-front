import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Event } from '../event';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Type } from '../type';
import { ActivatedRoute, Router  } from "@angular/router";
import * as $ from "jquery";
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-event', templateUrl: './event.component.html', styleUrls: ['./event.component.css']
})


export class EventComponent implements OnInit {

  events: Event[] = [];
  event: Event;
  event_types: string[];
  active_types: string[];
  next_page = environment.apiUrl+'events/?page=1';
  previous_page = null;
  visible = false;
  filter = false;
  title = '';
  private sub: any;
  current_id: number;
  prev_id: number; // id of previous check; need for compare previos and current choice
  shown_pages: number[] = [];
  constructor(private mapService: MapService, private eventService: EventsService, private route: ActivatedRoute, private router: Router) {
    /**
     * Subscribe to /event route params
     */
    this.sub = this.route.queryParams.subscribe(params => {
      // check id not equal selected id
      if (params['id'] && this.current_id != params['id'] && this.filter === false) {
        this.prev_id = this.current_id;
        this.current_id = params['id']; 
        this.getPageByEventId(params['id']);
      }else if (this.current_id == undefined) {
        this.getEvents(this.next_page, this.current_id, 'init');
      }
    });    
  }

  /**
   * Listener of event container scroll event
   * @param e
   */
  @HostListener('scroll', ['$event'])
  onScroll(e) {
    // When we scroll to bottom of the event container
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight;
    if (bottom === 0 && this.next_page !== null) {
      this.getEvents(this.next_page, this.current_id, 'next');
    }else
    // When we scroll to top of the event container
    if (e.target.scrollTop == 0 && this.previous_page !== null) {
      this.getEvents(this.previous_page, this.current_id, 'previous');
    }
  }

  ngOnInit(): void {
    this.getEventTypes();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      // make deep copy of event_types for storing checked ones
      this.active_types = this.event_types.slice();

    });
  }

  /**
   * Get page by event id and check is it shown in our list
   * @param id - id from selected event or from route param /event
   */
  getPageByEventId(id: number) {
    this.eventService.getPageByEventId(id).subscribe(page => {
      try {
        if (this.shown_pages.findIndex(pages => pages == page['PageNum']) == -1) {
          this.events = [];
          this.shown_pages = [];
          this.getEvents(`${environment.apiUrl}events/?page=${page['PageNum']}`, id, 'pagination');
        }
      }catch(e) {
        console.log(e);
        this.router.navigate(['event/not-found']);
      }

    });
  }

  /**
   * track elements that are shown in event page
   * @param index
   * @param event
   */
  trackByEventId(index: number, event: any): number {
    try{
      return event.id;
    }catch(e){return null}
    
  }

  /**
   *
   * @param url - url of current req(scroll to top - previous_page, scroll to bottom - next_page - next_page, default(init) - next_page
   * @param id - id of current active event
   * @param type -type of event(scroll to top, scroll to bottom, default - init event)
   */
  getEvents(url, id, type): void {
    this.eventService.getEvents(url).subscribe(eventpages => {
      try {
        const new_events = eventpages['results'];
        // set number of pafination to the event class that will be included to card component
        switch (type) {
          /**
           * Add event when we scroll to bottom of cards container, set next page
           */
          case 'next': {
            this.next_page = eventpages['next'];
            this.events = this.events.concat(new_events);
            break;
          }
          /**
           * Add event when we scroll to top of cards container, set previous page
           */
          case 'previous': {
            this.previous_page = eventpages['previous'];
            this.events = this.events.concat(new_events);
            break;
          }
          /**
           * First adding event(in ngOnInit), set next and previous page
           */
          case 'init':
          default: {
            this.next_page = eventpages['next'];
            this.previous_page = eventpages['previous'];
            this.events = this.events.concat(new_events);
            break;
          }
        }
        // check if number of pagination is in current url
        if (Number.isInteger(+url.match(/\d+$/ig))) {
          this.shown_pages = this.shown_pages.concat(+url.match(/\d+$/ig));
        }else {
          this.shown_pages = this.shown_pages.concat(1);
        }
        this.mapService.OnFilter(this.events);
        if ( id == undefined ) {
          console.log('id undefined');
         // this.mapService.MakeActive(this.events[0]);
          this.mapService.OnCardClick(this.events[0],type);
        }else{
          console.log('here event');
          this.mapService.OnCardClick(this.events[this.events.findIndex(event => event.id == id)], type);
        }
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
  /**
   * Set filter visible
   */
  setVisible() {
    this.visible = !this.visible;
    // scroll to the top when filter is visible (because filter block has relative position)
    if (this.visible === true) {
      document.querySelector('.target').scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  /**
   * Emit changing in active types by filter icon click
   * @param event - new array of active types
   */
  viewChanges(event) {
    this.active_types = event;
    // call filtering on filter icon click
    this.getEventsByFilters();
    // this.router.navigate(['event']);
  }

  /**
   * Emit changing in name search by enter click
   * @param event - current value in search input
   */
  viewTitle(event) {
    this.title = event;
    // call filtering on Enter click
    this.getEventsByFilters();
    // this.router.navigate(['event']);
  }

  /**
   * called on click or search. Check and retrieve parameters before passing to filter. Multiple filtrations
   *
   */
  getEventsByFilters(): void {
    // if types empty assign 'none', else make a string
    const types_str = this.active_types.length !== 0 ? this.active_types.join('&') : 'none';
    const t = (this.title === '') ? 'all' : this.title;
    this.filter = (this.title !== '' || this.active_types.length !== this.event_types.length) ? true : false;
    // const sd = (start_date === '') ? 'all' : start_date;
    // const ed = (end_date === '') ? 'all' : end_date;
    this.eventService.getEventsByFilters(t, 'all', types_str, 'all', 'all').subscribe(events => {
      // this.router.navigate(['event']);
      this.events = events['results'];
      this.next_page = events['next'];
      this.mapService.OnFilter(this.events);
      this.mapService.ResetZoom(39, 34, 1);

      if (this.events.length > 0) {
        this.current_id = this.events[0].id;
        this.mapService.MakeActive(this.events[0]);
        console.log('after null select');
      } else {
        this.mapService.MakeActive(null);
      }

    });
  }





}
