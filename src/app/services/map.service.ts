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
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { EventSatellite } from '../EventSatellite';
import * as Compare from 'mapbox-gl-compare';

@Injectable()
export class MapService {

  current_id: number;
  map: any;
  style: any;
  beforeMap: any;
  afterMap: any;
  // used for binding event(event card) and marker on map
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent = this.eventSource.asObservable();

  // url to satellite images
  private url_media = 'https://media-test-service.herokuapp.com/images/event/'; 
  private url = 'https://a.render.eosda.com/';
  private compareSource = new BehaviorSubject<boolean>(false);
  currentCompare = this.compareSource.asObservable();
  constructor(private httpClient: HttpClient) {
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

  setCompare(visible: boolean) {
    this.compareSource.next(visible);
  }

  /**
   * makes first event chosen by default after page loading or filtering
   * @param event
   */
  MakeActive(event: Event) {
    //Check if we choose the same event twice
    if (this.current_id !== event.id) {
      this.eventSource.next(event);
      this.current_id = event.id;
      //console.log('changed');
    }
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
    if (e.affected_area && e.affected_area['coordinates'].length>0) {
      this.map.getSource('polygon').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: e.affected_area['coordinates'][0]
        }
      });
    } else {
      // hot fix
      this.map.getSource('polygon').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[0, 0], [0, 0]]
        }
      });
    }
    this.MakeActive(e);
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
  }

  /** 
   * reset zoom after pagination
  */
  ResetZoom() {
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
        el.style.backgroundImage = 'url(/assets/' + event.event_type.toString() + '.png)';
        // (event.event_type.toString() === 'Wildfire') ? 'url(/assets/Wildfire.png)' : 'url(/assets/Flood.png)';
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


  /**
   * add two images to compare slider
   * @param beforeObj image to compare before
   * @param afterObj image to compare after
   */
  AddToCompare(beforeObj: any, afterObj: any) {

    //console.log(  this.MakeTileUrl(afterObj));
    this.ClearMaps();
    // add new source and layer
    this.beforeMap.addSource('raster-tiles', {
      type: 'raster',
      tiles:
        this.MakeTileUrl(beforeObj)
      ,
      tileSize: 256
    });

    this.beforeMap.addLayer({
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    });

    // set new center
    this.beforeMap.setCenter([beforeObj.tileCenter_lon, beforeObj.tileCenter_lat]);



    this.afterMap.addSource('raster-tiles', {
      type: 'raster',
      tiles:
        //array of tiles

        this.MakeTileUrl(afterObj)
      ,
      tileSize: 256
    });

    this.afterMap.addLayer({
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    });

    this.afterMap.setCenter([afterObj.tileCenter_lon, afterObj.tileCenter_lat]);

  }

  ClearMaps() {
    // delete only if sources and layers are present
    if(!this.beforeMap.getSource('raster-tiles'))
    return;
    // remove previous layer and source from before map
    this.beforeMap.removeLayer('simple-tiles');
    this.beforeMap.removeSource('raster-tiles');
    // remove previous layer and source from after map
    this.afterMap.removeLayer('simple-tiles');
    this.afterMap.removeSource('raster-tiles');
  }

  /**
   * make url to antarctica depend on satellite
   * @param obj image obj 
   */
  MakeTileUrl(obj: any): any[] {

    let part_url = this.url;
    switch (obj.satelliteName) {
      case 'modis':
        part_url += 'MODIS/' + obj.sceneID + '/B01,B04,B03/{z}/{x}/{y}';
        break;
      case 'Sentinel-2B' || 'Sentinel-2A':
        part_url += 'S2' + obj.sceneID + '/B04,B03,B02/{z}/{x}/{y}';
        break;
      case 'landsat-7':
        part_url += 'L7/' + obj.sceneID + '/B3,B2,B1/{z}/{x}/{y}';
        break;
      case 'landsat-8':
        part_url += 'L8/' + obj.sceneID + '/B4,B3,B2/{z}/{x}/{y}';
        break;


    }
    // create url to {a-d} servers
    let arr = [];
    arr.push(part_url);
    arr.push(part_url.replace('a', 'b'));
    arr.push(part_url.replace('a', 'c'));
    arr.push(part_url.replace('a', 'd'));

    return arr;
  }

  /** 
   * init map for compare slider
  */
  InitMapModal() {

    this.beforeMap = new mapboxgl.Map({
      container: 'before',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              ''
            ],

            tileSize: 256
          }
        },
        layers: [{
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: [0, 0],
      zoom: 7
    });


    this.afterMap = new mapboxgl.Map({
      container: 'after',
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              ''
            ],

            tileSize: 256
          }
        },
        layers: [{
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: [0, 0],
      zoom: 7
    });



    // add to compare slider
    var map = new Compare(this.beforeMap, this.afterMap, {});
  }

  /**
   * returns array of sat image object
   * @param id event id
   */
  getSatelliteImages(id: number): Observable<any> {
    //console.log(this.url_media + id+'/');
    return this.httpClient.get<any>(this.url_media + id).pipe(catchError(this.handleError('getSatelliteImages', [])));
  }

  /**
   * returns two images for initial comparer  
   * @param id event id
   */
  getSatelliteImagesCompare(id: number): Observable<any> {
    // console.log(this.url_media_compare + id+'/more');
    return this.httpClient.get<any>(this.url_media + id + '/more').pipe(catchError(this.handleError('getSatelliteImagesCompare', [])));
  }

  /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }




}
