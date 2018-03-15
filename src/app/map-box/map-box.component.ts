import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Event } from '../event';
import * as mapboxgl from 'mapbox-gl';
import { EventsService } from '../services/events.service';
import { MapService } from '../services/map.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  events: Event[];
  evt: Event;
  visible = false;

  map: any;
  layer: any;
  source: any;


  constructor(private eventService: EventsService, private mapService: MapService) {
    
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
    this.buildMap();

  }

  /**
   * creates map and set it object to mapService.Creates html custom markers
   */
  buildMap(): void {
    // init map in service
    this.map = this.mapService.InitMap(-102, 35, 4);

  }

  showFeature() {
    this.mapService.fitToBounds();
  } 
  close() {
    this.mapService.deleteAll();
  }


}
