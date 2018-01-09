import {Component, OnInit} from '@angular/core';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
import {catchError, map, tap} from 'rxjs/operators';
import {MapService} from '../services/map.service'
import { Observable } from "rxjs";

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  events: Event[];
  event: Event;

  zoom:Observable<number>;
  long:Observable<number>;
  lat:Observable<number>;

  constructor(private eventService: EventsService, private mapService: MapService) {
    this.zoom = this.mapService.GetZoom();
    this.long = this.mapService.GetLong();
    this.lat = this.mapService.GetLat();
    //console.log(this.zoom);
  }



  ngOnInit(): void {
    this.getEvents();
  }


  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  getEvent(): void {
    this.eventService.getEvent(4).subscribe(event => this.event = event);
  }



}
