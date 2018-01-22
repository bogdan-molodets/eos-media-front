import {Injectable, ElementRef} from '@angular/core';
import {Event} from '../event';
import * as mapboxgl from 'mapbox-gl';
import {EventsService} from '../services/events.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isNumber, isUndefined} from 'util';

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
  }


  OnFilter(events: Event[]) {
    // var el: HTMLCollectionOf<Element> = document.getElementsByClassName('marker');
    // events.forEach(function (event: Event) {
    //   if (!el.(event.id, 0)) {
    //     var e = document.getElementById(event.id.toString());
    //     e.style.visibility = 'hidden';
    //   }
    // });
  }

  // changeInitMap(z: number, ln: number, lt: number, v: boolean, e: Event) {
  //   this.zoomSource.next(z);
  //   this.longSource.next(ln);
  //   this.latSource.next(lt);
  //   this.visibleSource.next(v);
  //   this.eventSource.next(e);
  //   // this.viewSource.next()
  // }


}
