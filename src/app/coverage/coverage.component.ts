import { Component, OnInit } from '@angular/core';
import {Tweet} from '../tweet';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {
  tweets: Tweet[];
  tweet: Tweet;
  constructor(private eventService: EventsService) {
  }

  ngOnInit() {
    this.getTweets();
  }
  getTweets(): void {
    this.eventService.getTweets().subscribe(tweets => this.tweets = tweets);
  }
}
