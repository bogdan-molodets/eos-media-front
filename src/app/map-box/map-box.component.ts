import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {
  MapComponent,
  ViewComponent,
  LayerComponent,
  SourceComponent,
  FeatureComponent,
  GeometryPointComponent
} from 'ngx-openlayers';
import {MapService} from '../services/map.service';

import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {
  @ViewChild(ViewComponent) view: ViewComponent;

  zoom: number;
  lat: number;
  long: number;
  events: Event[];
  evt: Event;
  visible = false;

  constructor(private eventService: EventsService, private mapService: MapService) {
    // this.view=this.
  }

  ngOnInit(): void {
    this.mapService.currentZoom.subscribe(zoom => {
      this.zoom = zoom;
    });
    this.mapService.currentLong.subscribe(long => this.long = long);
    this.mapService.currentLat.subscribe(lat => this.lat = lat);
    this.mapService.currentVisible.subscribe(v => this.visible = v);
    this.mapService.currentEvent.subscribe(e => this.evt = e);
    // this.mapService.currentView.subscribe((view => this.view = view));
    // this.mapService.currentView.subscribe((view => this.view.instance.setZoom(7)));
    /// this.view.instance.setZoom(7);
    this.getEvents();
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
    this.mapService.OnPointClick(evn, this.events);

  }

  // mapOnZoom(evn: any): void {
  //   console.log("occured");
  //   console.log(evn.key);
  //   evn.target.getView().setZoom(7);
  //   // const mp = evn.getView().setZoom(7);
  //  // mp.getView().setZoom(7);
  // }


}
