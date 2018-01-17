import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Event} from '../event';

import * as mapboxgl from 'mapbox-gl';
import {Map, Marker, Layer, Source} from 'mapbox-gl';
import {EventsService} from '../services/events.service';
// import {
//   MapComponent,
//   ViewComponent,
//   LayerComponent,
//   SourceComponent,
//   FeatureComponent,
//   GeometryPointComponent
// } from 'ngx-openlayers';
import {MapService} from '../services/map.service';

import {Observable} from 'rxjs/Observable';
// import GeoJSONSource = mapboxgl.GeoJSONSource;
// import SymbolLayout = mapboxgl.SymbolLayout;
// import GeoJSONSource = mapboxgl.GeoJSONSource;
//
// import {FeatureCollection, Feature, Point} from "geojson";

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
  // layout: SymbolLayout;
  // source: GeoJSONSource;
  // features: Feature<Point>;
  // point:Point;

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
    this.map = this.mapService.getInitMap();



    //this.buildMap();
  }


  getEvents(): void {
    /*this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });*/
    this.eventService.getEvents().subscribe(eventpages => {
      try{
        console.log(eventpages);
        this.events = eventpages['results'];
        console.log(this.events);
      }catch(err){
        console.log(err);
      }
    });
  }

  mapOnClick(evn: any): void {
    // this.mapService.OnPointClick(evn, this.events);
    this.map.setZoom(7);
  }


  buildMap(): void {
    /*
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/dark-v9',
          center: [-102, 35], // starting position [lng, lat]
          zoom: 4
        }).addControl(new mapboxgl.NavigationControl());


        this.eventService.getEvents().subscribe(events => {
          this.events = events;
          this.events.forEach((event) => {

            const el = document.createElement('div');
            el.id = event.id.toString();
            el.className = 'marker';
            el.style.backgroundImage = 'url(/assets/fire.png)';
            el.style.width = '32px';
            el.style.height = '32px';
            const marker = new mapboxgl.Marker(el).setLngLat([event.event_lon, event.event_lat])
            .addTo(map);
            el.addEventListener('click', function () {
              map.flyTo({
                center: [event.event_lon, event.event_lat],
                zoom: 15
              });
            });
          });


        });*/
  }
}
