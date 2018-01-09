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

  showEvent(id): void {
    console.log(id);
  }  

  constructor(private mapService: MapService) {
  }

  onClick(event:Event){
    console.log(event.id);
    this.mapService.OnEventClick(event);
  }

  ngOnInit() {

  }

  // обрабатываем клик и в ивентах находим одно событие

}
