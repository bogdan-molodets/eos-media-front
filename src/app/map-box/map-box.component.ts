import {Component, OnInit} from '@angular/core';
import {Event} from '../event';
import {EventsService} from '../services/events.service';
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


  getEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;

    });
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
