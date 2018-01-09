import {Component, OnInit} from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {proj, View} from 'openlayers';
import {catchError, map, tap} from 'rxjs/operators';

import {isUndefined} from 'util';


@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  public zoom = 5;
  public long = 5.795122;
  public lat = 45.210225;

  events: Event[];
  event: Event;

  constructor(private eventService: EventsService) {
  }

  ngOnInit(): void {

    this.getEvents();
  }

  // /// default settings
  // map: mapboxgl.Map;
  // events$: Event[];
  // /*style = 'mapbox://styles/mapbox/outdoors-v9';
  // lat = 37.75;
  // lng = -122.41;*/
  // // message = 'Hello World!';
  //
  // // data
  // source: any;
  // markers: any;
  //
  // constructor(private eventService: EventsService) {
  // }
  //
  //
  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;

    });
  }

  showOne(event: Event): void {
    console.log(event);
    this.zoom = 4;
    this.long = event.event_lon;
    this.lat = event.event_lat;
  }

  mapOnClick(evn: any): void {
    const mp = evn.map;

    const clicked_feature = mp.forEachFeatureAtPixel(evn.pixel, function (feature, layer) {
      return feature;
    });
    if (!isUndefined(clicked_feature)) {
      // const latlon_coords = proj.transform(xy_coords, 'EPSG:3857', 'EPSG:4326');
      // this.long = latlon_coords[0];
      // this.lat = latlon_coords[1];
      mp.getView().setZoom(7);
      mp.getView().setCenter(clicked_feature.getGeometry().getCoordinates());

    }


  }


}
