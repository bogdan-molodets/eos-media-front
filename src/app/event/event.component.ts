import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Event } from '../event';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { TweetService } from '../services/tweet.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Type } from '../type';
import { Routes, RouterModule, ActivatedRoute, Router  } from "@angular/router";

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
  previous_page = null;
  visible = false;
  title = '';
  private sub: any;
  current_id:number;
  current_page:number;
  shown_pages:number[] = [];

  constructor(private mapService: MapService, private eventService: EventsService, private tweetService: TweetService, private route: ActivatedRoute, private router: Router) {
    /**
     * Subscribe to /event route params
     */
    this.sub = this.route.params.subscribe(params =>{
      //check id not equal selected id
      if(params['id'] && this.current_id!=params['id']){
        this.current_id = params['id'];
        this.getPageByEventId(this.current_id);
      }
    });
  }

  /**
   * Listener of event container scroll event
   * @param e 
   */
  @HostListener('scroll', ['$event'])
  onScroll(e) {
    //When we scroll to bottom of the event container
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight;
    if (bottom === 0 && this.next_page !== null) {
      this.getEvents(this.next_page, this.current_id, 'next');
    }else
    //When we scroll to top of the event container
    if(e.target.scrollTop == 0 && this.previous_page !== null){
      this.getEvents(this.previous_page, this.current_id, 'previous');
    }
  }

  ngOnInit(): void {
    this.getEvents(this.next_page, this.current_id, '');
    this.getEventTypes();
    this.route.snapshot.params.id;
  }
  
  ngOnDestroy():void{
    this.sub.unsubscribe();
  }

  getEventTypes(): void {
    this.eventService.getEventTypes().subscribe(event_types => {
      this.event_types = event_types['event_types'];
      //make deep copy of event_types for storing checked ones
      this.active_types = this.event_types.slice();

    });
  }
  
  /**
   * Get page by event id and check is it shown in our list
   * @param id - id from selected event or from route param /event 
   */
  getPageByEventId(id:number){
    this.eventService.getPageByEventId(id).subscribe(page=>{
      try{
        if(this.shown_pages.findIndex(pages => pages == page["PageNum"]) == -1){
          this.events = [];
          this.shown_pages = [];
          this.getEvents(`https://media-test-service.herokuapp.com/events/?page=${page["PageNum"]}`,id,' ');
        }
      }catch(e){
        this.router.navigate(['event/not-found']);
      }
            
    });
  }

  /**
   * track elements that are shown in event page
   * @param index 
   * @param event 
   */
  trackByEventId(index: number, event: any):number{
    return event.id;
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
        let new_events = eventpages['results'];
        //set number of pafination to the event class that will be included to card component
        switch (type){
          /**
           * Add event when we scroll to bottom of cards container, set next page
           */
          case 'next':{
            this.next_page = eventpages['next'];
            this.events = this.events.concat(new_events);
            break; 
          }
          /**
           * Add event when we scroll to top of cards container, set previous page
           */
          case 'previous':{
            this.previous_page = eventpages['previous'];
            this.events = this.events.concat(new_events);
            break;
          }
          /**
           * First adding event(in ngOnInit), set next and previous page
           */
          default:{
            this.next_page = eventpages['next'];
            this.previous_page = eventpages['previous'];
            this.events = this.events.concat(new_events);
            console.log('default');
            break; 
          }
        }
        //check if number of pagination is in current url
        if(Number.isInteger(+url.match(/\d+$/ig))){
          this.shown_pages = this.shown_pages.concat(+url.match(/\d+$/ig));
        }else{
          this.shown_pages = this.shown_pages.concat(1);
        }
        this.mapService.OnFilter(this.events);
        if ( id == undefined ) {
          this.mapService.MakeActive(this.events[0]);
        }else{
          this.mapService.MakeActive(this.events[this.events.findIndex(event => event.id == id)]);
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
  /**
   * Set filter visible
   */
  setVisible() {
    this.visible = !this.visible;
    //scroll to the top when filter is visible (because filter block has relative position)
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
    //call filtering on filter icon click
    this.getEventsByFilters();

  }

  /**
   * Emit changing in name search by enter click
   * @param event - current value in search input
   */
  viewTitle(event) {
    this.title = event;
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
      this.mapService.ResetZoom();

      if (this.events.length > 0) {
        this.mapService.MakeActive(this.events[0]);
      } else {
        this.mapService.MakeActive(null);
      }

    });
  }





}
