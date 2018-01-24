import { Injectable} from '@angular/core';
import { Event } from '../event';
import * as mapboxgl from 'mapbox-gl';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isNumber, isUndefined } from 'util';

// import {ViewComponent} from 'ngx-openlayers';

@Injectable()
export class MapService {


  map: any;

  // zoom: number;
  // lat: number;
  // long: number;
  // private map: Map;
  // // private map:ElementRef
  // private zoomSource = new BehaviorSubject<number>(5);
  // currentZoom = this.zoomSource.asObservable();
  // private longSource = new BehaviorSubject<number>(-102);
  // currentLong = this.longSource.asObservable();
  // private latSource = new BehaviorSubject<number>(38);
  // currentLat = this.latSource.asObservable();
  // private visibleSource = new BehaviorSubject<boolean>(false);
  // currentVisible = this.visibleSource.asObservable();
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent = this.eventSource.asObservable();


  constructor(private eventService: EventsService) {
  }

  /**
   * zoom and center map on card/marker click. Scroll to card if it is not visible on page
   * @param {Event} e
   * @param {number} ln longtitude
   * @param {number} lt latitude
   * @constructor
   */
  OnCardClick(e: Event, ln: number, lt: number): void {
    // center and zoom map to chosen event
    this.map.flyTo({
      center: [ln, lt],
      zoom: 10
    });
    // check if event has an aoi and draw it
    if (e.affected_area) {
      this.map.getSource('polygon').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: e.affected_area['coordinates'][0]
        }
      });
    }
    this.eventSource.next(e);
    // scroll to card
    var event_el = document.getElementById(e.id + 'card').scrollIntoView({ behavior: 'smooth' });

  }

  /**
   * display only that markers which id's is in events list
   * @param {Event[]} events
   * @constructor
   */
  OnFilter(events: Event[]) {
    
      var el: HTMLCollectionOf<Element> = document.getElementsByClassName('marker');
      this.CreateMarkers(events, this.map);
      for (let i = 0; i < el.length; i++) {

        // if()
        const e = document.getElementById(el[i].id);
        // refresh
        
        if (!events.find(function (event: Event) {
          return event.id.toString() === el[i].id;
        })) {
         
          e.style.visibility = 'hidden';
        }else {
          e.style.visibility = 'visible';
        }
      }
    

  }

  /**
   * create html markers
   * @param {Event[]} events
   * @param mp - map object
   * @constructor
   */
  CreateMarkers(events: Event[], mp: any) {
    
      events.forEach((event) => {

        this.map = mp;
        // create marker div
        if (!document.getElementById(event.id.toString())) {
          const el = document.createElement('div');
          el.id = event.id.toString();
          el.className = 'marker';
          el.style.backgroundImage = (event.event_type.toString() === 'Wildfire') ? 'url(/assets/fire.png)' : 'url(/assets/flood.png)';
          el.style.cursor = 'pointer';
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.visibility = 'visible';
          const marker = new mapboxgl.Marker(el).setLngLat([event.event_lon, event.event_lat])
            .addTo(this.map);
          ////////
          // add onclick event to marker

          var s = this;
          el.addEventListener('click', function () {
            s.OnCardClick(event, event.event_lon, event.event_lat);
          });
        }

      });
    
  }


}
