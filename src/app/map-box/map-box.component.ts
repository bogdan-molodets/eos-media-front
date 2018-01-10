import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {

  MapComponent,
  ViewComponent,
  LayerComponent,
  SourceComponent,
  FeatureComponent,
  GeometryPointComponent
} from 'ngx-openlayers';
import {MapService} from '../services/map.service';

import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {
@ViewChild(ViewComponent) view: ViewComponent;
  // zoom: Observable<number>;
  // long: Observable<number>;
  // lat: Observable<number>;
  // public zoom = 5;
  zoom: number;
  lat: number;
  long: number;
  // public long = 5.795122;
  // public lat = 45.210225;

  events: Event[];
  evt: Event;
  visible = false;

  constructor(private elementRef: ElementRef, private eventService: EventsService, private mapService: MapService) {
  }

  ngOnInit(): void {
    // const map = new MapComponent(null);
    // map.instance.setTarget('map');
    // const mp = this.elementRef.nativeElement.map
  //this.view.instance.setZoom()
    this.mapService.currentZoom.subscribe(zoom => this.zoom = zoom);
    this.mapService.currentLong.subscribe(long => this.long = long);
    this.mapService.currentLat.subscribe(lat => this.lat = lat);
    this.mapService.currentVisible.subscribe(v => this.visible = v);
    this.mapService.currentEvent.subscribe(e => this.evt = e);

    // this.zoom = this.mapService.GetZgoom();
    // this.long = this.mapService.GetLong();
    // this.lat = this.mapService.GetLat();

    this.getEvents();
  }


  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }


  mapOnClick(evn: any): void {
    this.mapService.OnPointClick(evn);
  }


}
