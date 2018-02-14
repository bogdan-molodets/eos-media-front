import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Event } from '../event';

import * as mapboxgl from 'mapbox-gl';

import { EventsService } from '../services/events.service';

import { MapService } from '../services/map.service';

import { Observable } from 'rxjs/Observable';

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

  next_page= 'https://media-test-service.herokuapp.com/events/?page=1';

  constructor(private eventService: EventsService, private mapService: MapService) {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w';

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


}
