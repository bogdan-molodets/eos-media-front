import { Injectable } from '@angular/core';
import { Event } from '../event';
import * as mapboxgl from 'mapbox-gl';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { isNumber, isUndefined } from 'util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Injectable()
export class MapService {


  map: any;
  style: any;

  // used for binding event(event card) and marker on map
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent = this.eventSource.asObservable();


  constructor(private eventService: EventsService) {

  }


  /**
   * initialize map and add polygon empty layers
   * @param centerLon
   * @param centerLat
   * @param zoom
   */
  InitMap(centerLon: number, centerLat: number, zoom: number): any {

    this.map = new mapboxgl.Map({
      container: 'map',
      style: window.location.origin + '/assets/osm.json',
      center: [-102, 35], // starting position [lng, lat]
      zoom: 4,
      attributionControl: false
    }).addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Search for a place',
    }), 'top-left');

    const m = this.map;
    this.map.on('load', function () {

      // add source with our polygon
      m.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 0]]]
          }
        }
      });
      // layer for source display
      m.addLayer({
        id: 'showpoly',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#f7786b',
          'fill-opacity': 0.3
        }
      });

    });
    return this.map;
  }

  /**
   * makes first event chosen by default after page loading or filtering
   * @param event
   */
  MakeActive(event: Event) {
    this.eventSource.next(event);
  }
  /**
   * zoom and center map on card/marker click. Scroll to card if it is not visible on page
   * @param {Event} e
   * @param {number} ln longtitude
   * @param {number} lt latitude
   * @constructor
   */
  OnCardClick(e: Event, ln: number, lt: number): void {
    // center and zoom map to chosen event
    this.map.flyTo({
      center: [ln, lt],
      zoom: 10
    });
    // check if event has an aoi and draw it
    if (e.affected_area) {
      this.map.getSource('polygon').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: e.affected_area['coordinates'][0]
        }
      });
   }else{
     // hot fix
    this.map.getSource('polygon').setData({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[0, 0], [0, 0]]
      }
    });
   }
    this.eventSource.next(e);
    // scroll to card
    const event_el = document.getElementById(e.id + 'card').scrollIntoView({ behavior: 'smooth' });

  }

  /**
   * display only that markers which id's is in events list
   * @param {Event[]} events
   * @constructor
   */
  OnFilter(events: Event[]) {

    // hot fix
    // this.map.getSource('polygon').setData({
    //   type: 'Feature',
    //   geometry: {
    //     type: 'Polygon',
    //     coordinates: [[0,0],[0,0]]
    //   }
    // });


    const el: HTMLCollectionOf<Element> = document.getElementsByClassName('marker');

    this.CreateMarkers(events);
    for (let i = 0; i < el.length; i++) {

      // if()
      const e = document.getElementById(el[i].id);
      // refresh

      if (!events.find(function (event: Event) {
        return event.id.toString() === el[i].id;
      })) {

        e.style.visibility = 'hidden';
      } else {
        e.style.visibility = 'visible';
      }
    }
    this.map.flyTo({
      center: [-102, 35],
      zoom: 4
    });


  }

  /**
   * create html markers
   * @param {Event[]} events
   * @param mp - map object
   * @constructor
   */
  CreateMarkers(events: Event[]) {

    events.forEach((event) => {


      // create marker div
      if (!document.getElementById(event.id.toString())) {
        const el = document.createElement('div');
        el.id = event.id.toString();
        el.className = 'marker';
        el.style.backgroundImage = (event.event_type.toString() === 'Wildfire') ? 'url(/assets/Wildfire.png)' : 'url(/assets/Flood.png)';
        el.style.cursor = 'pointer';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.visibility = 'visible';
        const marker = new mapboxgl.Marker(el).setLngLat([event.event_lon, event.event_lat])
          .addTo(this.map);
        ////////
        // add onclick event to marker

        const s = this;
        el.addEventListener('click', function () {
          s.OnCardClick(event, event.event_lon, event.event_lat);
        });
      }

    });

  }





}