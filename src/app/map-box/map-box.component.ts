import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Event} from '../event';

import * as mapboxgl from 'mapbox-gl';
import {Map, Marker, Layer, Source} from 'mapbox-gl';
import {EventsService} from '../services/events.service';

import {MapService} from '../services/map.service';

import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {
  // @ViewChild(ViewComponent) view: ViewComponent;

  // zoom: number;
  // lat: number;
  // long: number;
  events: Event[];
  evt: Event;
  visible = false;
  layer: Layer;
  map: mapboxgl.Map;

  constructor(private eventService: EventsService, private mapService: MapService) {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w';

  }

  ngOnInit(): void {
    // this.mapService.currentZoom.subscribe(zoom => {
    //   this.zoom = zoom;
    // });
    // this.mapService.currentLong.subscribe(long => this.long = long);
    // this.mapService.currentLat.subscribe(lat => this.lat = lat);
    // this.mapService.currentVisible.subscribe(v => this.visible = v);
    // this.mapService.currentEvent.subscribe(e => this.evt = e);
    //this.map = this.mapService.getInitMap();


    this.buildMap();
  }


  getEvents(): void {
    /*this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });*/
    this.eventService.getEvents().subscribe(eventpages => {
      try {

        this.events = eventpages['results'];
      } catch (err) {
        console.log(err);
      }
    });
  }

  mapOnClick(evn: any): void {
    // this.mapService.OnPointClick(evn, this.events);
    this.map.setZoom(7);
  }

  mapAddPolygon():void{
    var m = this.map
    this.map.on('load', function () {

      m.addLayer({
          'id': 'maine',
          'type': 'fill',
          'source': {
              'type': 'geojson',
              'data': {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [[[-67.13734351262877, 45.137451890638886],
                          [-66.96466, 44.8097],
                          [-68.03252, 44.3252],
                          [-69.06, 43.98],
                          [-70.11617, 43.68405],
                          [-70.64573401557249, 43.090083319667144],
                          [-70.75102474636725, 43.08003225358635],
                          [-70.79761105007827, 43.21973948828747],
                          [-70.98176001655037, 43.36789581966826],
                          [-70.94416541205806, 43.46633942318431],
                          [-71.08482, 45.3052400000002],
                          [-70.6600225491012, 45.46022288673396],
                          [-70.30495378282376, 45.914794623389355],
                          [-70.00014034695016, 46.69317088478567],
                          [-69.23708614772835, 47.44777598732787],
                          [-68.90478084987546, 47.184794623394396],
                          [-68.23430497910454, 47.35462921812177],
                          [-67.79035274928509, 47.066248887716995],
                          [-67.79141211614706, 45.702585354182816],
                          [-67.13734351262877, 45.137451890638886]]]
                  }
              }
          },
          'layout': {},
          'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.8
          }
      });
  });
  }




  buildMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9?optimize=true',
      center: [-102, 35], // starting position [lng, lat]
      zoom: 4
    }).addControl(new mapboxgl.NavigationControl());


    this.eventService.getEvents().subscribe(events => {
      this.events = events['results'];
      this.events.forEach((event) => {

        const el = document.createElement('div');
        el.id = event.id.toString();

        el.className = 'marker';
        el.style.backgroundImage = 'url(/assets/fire.png)';
        el.style.width = '32px';
        el.style.height = '32px';
        const marker = new mapboxgl.Marker(el).setLngLat([event.event_lon, event.event_lat])
        .addTo(this.map);
        var m = this.map;
        var s = this.mapService;
        el.addEventListener('click', function () {
          s.OnCardClick(event, event.event_lon, event.event_lat);
        });
      });

      this.mapService.map = this.map;

    });

  }


}
