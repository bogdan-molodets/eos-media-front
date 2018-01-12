import {Injectable, ElementRef} from '@angular/core';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isNumber, isUndefined} from 'util';
import {ViewComponent} from 'ngx-openlayers';

@Injectable()
export class MapService {
  // private map:ElementRef
  private zoomSource = new BehaviorSubject<number>(5);
  currentZoom = this.zoomSource.asObservable();
  private longSource = new BehaviorSubject<number>(-102);
  currentLong = this.longSource.asObservable();
  private latSource = new BehaviorSubject<number>(38);
  currentLat = this.latSource.asObservable();
  private visibleSource = new BehaviorSubject<boolean>(false);
  currentVisible = this.visibleSource.asObservable();
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent = this.eventSource.asObservable();
  // private viewSource = new BehaviorSubject<ViewComponent>(null);
  // currentView = this.viewSource.asObservable();


  constructor(private eventService: EventsService) {
  }

  changeInitMap(z: number, ln: number, lt: number, v: boolean, e: Event) {
    this.zoomSource.next(z);
    this.longSource.next(ln);
    this.latSource.next(lt);
    this.visibleSource.next(v);
    this.eventSource.next(e);
    // this.viewSource.next()
  }


  public OnCardClick(event: Event, v: boolean) {
    this.changeInitMap(7, event.event_lon, event.event_lat, v, event);
  }

  public OnPointClick(evn: any, events: Event[]) {

    const mp = evn.map;
    const clicked_feature = mp.forEachFeatureAtPixel(evn.pixel, function (feature, layer) {

      if (!isUndefined(feature.getId())) {
        return feature;
      }
    });

    if (!isUndefined(clicked_feature)) {
      const e = events.find(function (event: Event, index: number, array: Event[]) {
        return event.id === clicked_feature.getId();
      });
      console.log(e);
      // const e = clicked_feature.getId('id');
      mp.getView().setZoom(7);
      mp.getView().setCenter(clicked_feature.getGeometry().getCoordinates());
      this.eventSource.next(e);
      this.visibleSource.next(true);
    }


  }


  /*public GetZoom(): Observable<number> {
    return this.zoom.asObservable();
  }

  public GetLong(): Observable<number> {
    return this.long.asObservable();
  }

  public GetLat(): Observable<number> {
    return this.lat.asObservable();
  }

  private SetParams(event: Event) {
    this.zoom.next(6);
    this.lat.next(event.event_lat);
    this.long.next(event.event_lon);
  }*/
}
