import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  /// default settings
  map: mapboxgl.Map;
  /*style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;*/
  // message = 'Hello World!';

  // data
  source: any;
  markers: any;

  constructor() {
  }

  ngOnInit() {
    this.initializeMap();
    let marker = new mapboxgl.Marker()
    .setLngLat([30.5, 50.5])
    .addTo(this.map);
    let marker1 = new mapboxgl.Marker()
    .setLngLat([-90.4, 29.57])
    .addTo(this.map);
  }

  private initializeMap() {
    this.buildMap();
  }

  buildMap() {
    ( mapboxgl as any).accessToken = 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w';
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
      center: [-74.50, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  }

}