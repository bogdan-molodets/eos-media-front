import {Component, OnInit, Input} from '@angular/core';
import {Event} from '../event';
import {MapService} from '../services/map.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() event: Event;
  /*@Input() visible: boolean;*/
  constructor(private mapService: MapService) {
  }

  ngOnInit() {

  }

  onClick(event: Event) {
    this.mapService.OnCardClick(event, true);
  }

  // обрабатываем клик и в ивентах находим одно событие

}
