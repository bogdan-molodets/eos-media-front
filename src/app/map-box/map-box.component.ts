import {Component, OnInit} from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {catchError, map, tap} from 'rxjs/operators';


@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  public zoom = 15;
  public height = 1.0;
  public width = 5;
  events: Event[];

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

  //
  // ngOnInit() {
  //   this.initializeMap();
  //
  //   // this.eventService.getEvents().subscribe(events => this.events = events);
  //   this.getEvents();
  //   console.log(this.events$);
  //   const marker = new mapboxgl.Marker()
  //   .setLngLat([30.5, 50.5])
  //   .addTo(this.map);
  //   const marker1 = new mapboxgl.Marker()
  //   .setLngLat([-90.4, 29.57])
  //   .addTo(this.map);
  // }
  //
  // private initializeMap() {
  //   this.buildMap();
  // }
  //
  // buildMap() {
  //   ( mapboxgl as any).accessToken = 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w';
  //   this.map = new mapboxgl.Map({
  //     container: 'map', // container id
  //     style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
  //     center: [0, 0], // starting position [lng, lat]
  //     zoom: 4 // starting zoom
  //   });
  // }

}
