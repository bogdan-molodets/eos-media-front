import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
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
import { Router, ActivatedRoute, RouterState } from '@angular/router';

declare const FB: any;
declare const twttr: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() event: any;

  private url;
  private accessToken = 'pk.eyJ1IjoiYm9nZGFubW9sb2RldHMiLCJhIjoiY2pjMG9kZ3NjMDNhazJ4cXltNWdhYXh0diJ9.RbZ5rCF0N3-n5GKfGyrI3w';
  twitter_link;

  constructor(private mapService: MapService, private tweetService: TweetService, private router: Router) {
    const state: RouterState = router.routerState;
    const root: ActivatedRoute = state.root;
    this.url = root.firstChild;
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
    this.twitter_link = `https://twitter.com/share?url=https%3A%2F%2Fnews-dev.eos.com%2Fevent?id=${this.event.id}&hashtags=${this.event.event_type}%2C${this.event.title.replace(/ /g, '')}%2CEOSmedia%2CEOS&text=That%20${this.event.event_type}%20happened%20in%20${this.event.place}%20on%20${this.event.start_date}`;
  }

  /**
   * makes card active, center and zoom map to event marker. Loads tweets for chosen event
   * @param event clicked event
   */
  onClick(event: any) {

    this.mapService.OnCardClick(event, event.event_lon, event.event_lat);

    this.tweetService.getTweetsByEventId(event.id);

  }

  shareFacebook() {
    console.log(this.url);
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
        object: {
          'og:url': `https://news-dev.eos.com/#/event?id=${this.event.id}`,
          'og:title':  this.event.title,
          'og:description': `That ${this.event.event_type} happend in ${this.event.place} on ${this.event.start_date}`,
          'og:og:image:width': '512',
          'og:image:height': '512',
          'og:image:url': `https://api.mapbox.com/v4/mapbox.streets-basic/url-https%3A%2F%2Fnews-dev.eos.com%2Fassets%2F${this.event.event_type}.png(${this.event.event_lon},${this.event.event_lat})/${this.event.event_lon},${this.event.event_lat},10/512x512.png?access_token=${this.accessToken}`,
        }
      })
    },
    function (response) {
    // Action after response
    });
  }


  showCompare(id: number) {
    this.router.navigateByUrl('/event/compare', {queryParams: {id: id}});
    this.mapService.setCompare(true);

  }

}
