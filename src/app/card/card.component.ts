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

  showCompare(){
   // this.mapService.InitMapModal();
   //this.mapService.AddToCompare('http://a.render.eosda.com/L8/LC08_L1TP_041036_20171218_20171224_01_T1/B4,B3,B2/{z}/{x}/{y}','http://a.render.eosda.com/L8/LC08_L1TP_041036_20171202_20171207_01_T1/B4,B3,B2/{z}/{x}/{y}');
   this.mapService.getSatelliteImages(30).subscribe(res=>{
    //this.next_page = res['next'];
    //console.log(res);
    res = Object.values(res['results']);
    //console.log(res);
    let images =[];
    for(var i = 0; i < res.length; i++){
      images[i] = this.mapService.MakeTileUrl(res[i]);
    }
    //console.log(images);
    this.mapService.AddToCompare(images[0],images[4]);
    this.mapService.setCompare(true);
  });
    //this.mapService.setCompare(true);
  }
  // обрабатываем клик и в ивентах находим одно событие

}
