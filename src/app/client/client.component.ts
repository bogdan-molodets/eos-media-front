import { Component, OnInit} from '@angular/core';
import { MapService } from '../services/map.service';
import { Event } from '../event';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  activeBar = '';
  visible = false;
  event: Event;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.currentCompare.subscribe(visible => {
      this.visible = visible;
      if (visible) {
        this.mapService.currentEvent.subscribe(event => {
          this.event = event;
        });
      }
    }
    );
  }

  setActiveBar(active: string) {
    if (this.activeBar === active) {
      this.activeBar = '';
    }else {
      this.activeBar = active;
    }
  }

}
