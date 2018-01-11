import {Injectable, ElementRef} from '@angular/core';
import {Event} from '../event';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isUndefined} from 'util';

@Injectable()
export class MapService {
  private map:ElementRef
  private zoomSource = new BehaviorSubject<number>(3);
  currentZoom = this.zoomSource.asObservable();
  private longSource = new BehaviorSubject<number>(-102);
  currentLong = this.longSource.asObservable();
  private latSource = new BehaviorSubject<number>(38);
  currentLat = this.latSource.asObservable();
  private visibleSource = new BehaviorSubject<boolean>(false);
  currentVisible= this.visibleSource.asObservable();
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent= this.eventSource.asObservable();
  // public long = new BehaviorSubject<number>(5);
  // public lat = new BehaviorSubject<number>(45);

  constructor() {
  }

  changeInitMap(z: number, ln: number, lt: number, v: boolean, e: Event) {
    this.zoomSource.next(z);
    this.longSource.next(ln);
    this.latSource.next(lt);
    this.visibleSource.next(v);
    this.eventSource.next(e);
  }
  public GetMap(){
    return this.map;
  }
  public SetMap(map:ElementRef){
    this.map = map;
  }

  public OnCardClick(event: Event, v: boolean) {
    this.changeInitMap(7, event.event_lon, event.event_lat, v, event);
  }

  public OnPointClick(evn: any) {
    // get map object from click event
    const mp = evn.map;
    console.log(evn);
    console.log(evn.map);
    const clicked_feature = mp.forEachFeatureAtPixel(evn.pixel, function (feature, layer) {
      return feature;
    });
    if (!isUndefined(clicked_feature)) {
      mp.getView().setZoom(7);
      mp.getView().setCenter(clicked_feature.getGeometry().getCoordinates());

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
