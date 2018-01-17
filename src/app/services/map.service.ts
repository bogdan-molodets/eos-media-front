import {Injectable, ElementRef} from '@angular/core';
import {Event} from '../event';
import * as mapboxgl from 'mapbox-gl';
import {Map, Marker} from 'mapbox-gl';
import {EventsService} from '../services/events.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isNumber, isUndefined} from 'util';

// import {ViewComponent} from 'ngx-openlayers';

@Injectable()
export class MapService {


  getInitMap(): Map {
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-102, 35], // starting position [lng, lat]
      zoom: 4
    }).addControl(new mapboxgl.NavigationControl());
    return map;
  }

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
  // private viewSource = new BehaviorSubject<ViewComponent>(null);
  // // currentView = this.viewSource.asObservable();


  constructor(private eventService: EventsService) {
  }


  // changeInitMap(z: number, ln: number, lt: number, v: boolean, e: Event) {
  //   this.zoomSource.next(z);
  //   this.longSource.next(ln);
  //   this.latSource.next(lt);
  //   this.visibleSource.next(v);
  //   this.eventSource.next(e);
  //   // this.viewSource.next()
  // }


  // public OnCardClick(event: Event, v: boolean) {
  //   this.changeInitMap(7, event.event_lon, event.event_lat, v, event);
  // }

  // public OnPointClick(evn: any, events: Event[]) {
  //
  //   const mp = evn.map;
  //   const clicked_feature = mp.forEachFeatureAtPixel(evn.pixel, function (feature, layer) {
  //
  //     if (!isUndefined(feature.getId())) {
  //       return feature;
  //     }
  //   });
  //
  //   if (!isUndefined(clicked_feature)) {
  //     const e = events.find(function (event: Event, index: number, array: Event[]) {
  //       return event.id === clicked_feature.getId();
  //     });
  //     // console.log(e);
  //     // const e = clicked_feature.getId('id');
  //     mp.getView().setZoom(7);
  //     mp.getView().setCenter(clicked_feature.getGeometry().getCoordinates());
  //     this.eventSource.next(e);
  //     this.visibleSource.next(true);
  //   }
  //
  //
  // }
  //

}
