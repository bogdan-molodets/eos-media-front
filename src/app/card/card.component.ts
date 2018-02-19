import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../event';
import { MapService } from '../services/map.service';
import { TweetService } from '../services/tweet.service';
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
  constructor(private mapService: MapService, private tweetService: TweetService) {
  }

  public id = -1;

  ngOnInit() {
    // subscribe for event change and make card active
    this.mapService.currentEvent.subscribe(event => {
      try {
        this.id = event.id;
      } catch (e) {
      }
    });
  }

  /**
   * makes card active, center and zoom map to event marker. Loads tweets for chosen event
   * @param event clicked event
   */
  onClick(event: Event) {

    this.mapService.OnCardClick(event, event.event_lon, event.event_lat);

    this.tweetService.getTweetsByEventId(event.id);

  }

  showCompare(id: number) {
  
    this.mapService.setCompare(true);
  }
  // обрабатываем клик и в ивентах находим одно событие

}
