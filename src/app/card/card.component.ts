import {Component, OnInit, Input} from '@angular/core';
import {Event} from '../event';
import {MapService} from '../services/map.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() event: Event;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {

  }

  onClick(event: Event) {
    this.mapService.OnEventClick(event);
  }

  // обрабатываем клик и в ивентах находим одно событие

}
