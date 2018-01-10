import {Injectable, ElementRef} from '@angular/core';
import {Event} from '../event';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {isUndefined} from 'util';

@Injectable()
export class MapService {
  private map:ElementRef
  private zoomSource = new BehaviorSubject<number>(5);
  currentZoom = this.zoomSource.asObservable();
  private longSource = new BehaviorSubject<number>(5);
  currentLong = this.longSource.asObservable();
  private latSource = new BehaviorSubject<number>(45);
  currentLat = this.latSource.asObservable();
  // public long = new BehaviorSubject<number>(5);
  // public lat = new BehaviorSubject<number>(45);

  constructor() {
  }

  changeInitMap(z: number, ln: number, lt: number) {
    this.zoomSource.next(z);
    this.longSource.next(ln);
    this.latSource.next(lt);
  }
  public GetMap(){
    return this.map;
  }
  public SetMap(map:ElementRef){
    this.map = map;
  }

  public OnEventClick(event: Event) {
    this.changeInitMap(7, event.event_lon, event.event_lat);
  }

  public OnPointClick(evn: any) {
    // get map object from click event
    const mp = evn.map;

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
