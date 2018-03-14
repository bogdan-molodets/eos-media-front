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
import { Router } from '@angular/router';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from 'turf';
import * as ext from 'turf-extent'

@Injectable()
export class MapService {

  current_id: number;
  map: any;
  beforeMap: any;
  afterMap: any;
  feature: any;
  draw: any;
  area: any;
  area_mi: any;
  // used for binding event(event card) and marker on map
  private eventSource = new BehaviorSubject<Event>(null);
  currentEvent = this.eventSource.asObservable();

  // url to satellite images
  private url_media = 'https://media-test-service.herokuapp.com/images/event/';
  private url = 'https://a-render.eosda.com/';
  private compareSource = new BehaviorSubject<boolean>(false);
  currentCompare = this.compareSource.asObservable();
  constructor(private httpClient: HttpClient, private router: Router) {
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
      center: [centerLon, centerLat], // starting position [lng, lat]
      zoom: zoom,
      attributionControl: false
    }).addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Search for a place',
    }), 'top-left');


    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
    });

    // forbid user to drag polygon
    MapboxDraw.modes.simple_select.onDrag = function (e) { }
    MapboxDraw.modes.direct_select.onDrag = function (e) { }
    this.map.addControl(this.draw);
    const that = this;

    this.map.on('draw.create', function (e) {
      that.onCreate(e);
    });
    this.map.on('draw.delete', function (e) {
      that.deleteAll();
    });
    this.map.on('draw.update', function (e) {
      that.drawAreaBox(e.features[0]);
    });

    return this.map;
  }

  /**
   * let user draw only one figure at once
   * @param e event
   */
  onCreate(e: any) {

    // get all drawn features from map
    let data = this.draw.getAll();
    // delete all features when new one is created   
    if (data.features.length > 1) {
      this.draw.delete(this.feature.id);
    }
    // current feature
    this.feature = e.features[0];
    this.drawAreaBox(e.features[0]);
  }

  /**
   * calculate feature area 
   * @param feature drawn feature
   */
  drawAreaBox(feature: any) {

    const answer = document.getElementById('calculated-area');
    const area = turf.area(feature);
    // convert to km2 if area more than 1000000
    if (area < (1e6)) {
      // restrict to area to 2 decimal points
      this.area = Math.round(area * 100) / 100 + ' m' + '2'.sup();
      answer.innerHTML = '<p><strong>' + this.area + '</strong></p>';
    } else {
      this.area = Math.round((area * 1e-6) * 100) / 100 + ' km' + '2'.sup();
      this.area_mi = Math.round((area * 3.86e-7) * 100) / 100 + ' mi' + '2'.sup();
      answer.innerHTML = '<p><strong>' + this.area + '</strong></p>';
    }
    document.getElementById('box').style.visibility = 'visible';

    this.fitToBounds();
  }

  /**
   * zoom to feature
   */
  fitToBounds() {
    let b = turf.bbox(this.feature);
    this.map.fitBounds(b, {
      padding: 20
    });
  }

  deleteAll() {
    this.draw.deleteAll();
    document.getElementById('box').style.visibility = 'hidden';
  }

  setCompare(visible: boolean) {
    this.compareSource.next(visible);
  }

  /**
   * makes first event chosen by default after page loading or filtering
   * @param event
   */
  MakeActive(event: Event) {
    // Check if we choose the same event twice
    if (event == null) {
      this.eventSource.next(event);
      this.router.navigate(['event']);
    } else if (this.current_id !== event.id) {
      this.eventSource.next(event);
      this.current_id = event.id;

    }
  }
  /**
   * zoom and center map on card/marker click. Scroll to card if it is not visible on page
   * @param {Event} e
   * @param init - show init/noinit state  
   */
  OnCardClick(e: Event, init?: any): void {
    // center and zoom map to chosen event
    if (init != 'init') {
      this.ResetZoom(e.event_lon, e.event_lat, 10);
      this.router.navigate(['event'], { queryParams: { id: e.id } });
    }

    this.ClearPolygonSources();
    // check for polygon existence
    if (e.affected_area && e.affected_area['coordinates'].length > 0) {
      // add source with our polygon
      this.map.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: e.affected_area['coordinates'][0]
          }
        }
      });
      // layer for source display
      this.map.addLayer({
        id: 'showpoly',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#f7786b',
          'fill-opacity': 0.3
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

    this.ClearPolygonSources();
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
  ResetZoom(ln: number, lt: number, zoom: number) {
    this.map.flyTo({
      center: [ln, lt],
      zoom: zoom
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
          s.OnCardClick(event);
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


    this.ClearMaps();

    const layers = this.beforeMap.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    let firstSymbolId;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;

        break;
      }
    }

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
      minzoom: 5,
      maxzoom: 16
    }, firstSymbolId);

    this.afterMap.addSource('raster-tiles', {
      type: 'raster',
      tiles:
        // array of tiles

        this.MakeTileUrl(afterObj)
      ,
      tileSize: 256
    });

    this.afterMap.addLayer({
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 5,
      maxzoom: 16
    }, firstSymbolId);

    // set new center and zoom
    this.beforeMap.setCenter([beforeObj.tileCenter_lon, beforeObj.tileCenter_lat]);
    this.beforeMap.setZoom(7);
    this.beforeMap.setMinZoom(5);
    this.beforeMap.setMaxZoom(15);

    this.afterMap.setCenter([afterObj.tileCenter_lon, afterObj.tileCenter_lat]);
    this.afterMap.setZoom(7);
    this.afterMap.setMinZoom(5);
    this.afterMap.setMaxZoom(15);
  }

  ClearPolygonSources() {
    // delete only if sources and layers are present
    if (this.map.getSource('polygon')) {
      // remove previous layer and source from main map
      this.map.removeLayer('showpoly');
      this.map.removeSource('polygon');
    }
  }

  ClearMaps() {
    // delete only if sources and layers are present
    if (this.beforeMap.getSource('raster-tiles')) {
      // remove previous layer and source from before map
      this.beforeMap.removeLayer('simple-tiles');
      this.beforeMap.removeSource('raster-tiles');
      // remove previous layer and source from after map
      this.afterMap.removeLayer('simple-tiles');
      this.afterMap.removeSource('raster-tiles');
    }
  }

  /**
   * make url to antarctica depend on satellite
   * @param obj image obj
   */
  MakeTileUrl(obj: any): any[] {

    let part_url = this.url;
    switch (obj.satelliteName) {
      case 'modis':
        part_url += 'MODIS/' + obj.sceneID + '/RED,GREEN,BLUE/{z}/{x}/{y}';
        break;
      case 'Sentinel-2A':
      case 'Sentinel-2B':
        part_url += 'S2' + obj.sceneID + '/RED,GREEN,BLUE/{z}/{x}/{y}';
        break;
      case 'landsat-7':
        part_url += 'L7/' + obj.sceneID + '/RED,GREEN,BLUE/{z}/{x}/{y}';
        break;
      case 'landsat-8':
        part_url += 'L8/' + obj.sceneID + '/RED,GREEN,BLUE/{z}/{x}/{y}';
        break;


    }
    // create url to {a-d} servers
    const arr = [];
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
      style: window.location.origin + '/assets/osm.json',
      center: [0, 0],
      zoom: 7,

    });
    this.beforeMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.afterMap = new mapboxgl.Map({
      container: 'after',
      style: window.location.origin + '/assets/osm.json',
      center: [0, 0],
      zoom: 7,

    });

    // add to compare slider
    const map = new Compare(this.beforeMap, this.afterMap, {});
  }

  /**
   * returns array of sat image object
   * @param id event id
   */
  getSatelliteImages(page: string): Observable<any> {
    return this.httpClient.get<any>(page).pipe(catchError(this.handleError('getSatelliteImages', [])));
  }

  /**
   * returns two images for initial comparer
   * @param id event id
   */
  getSatelliteImagesCompare(id: number): Observable<any> {
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

  public changeHttp(res) {
    res['imageURL'] = res['imageURL'].replace('http:', 'https:');
    return res;
  }





}
