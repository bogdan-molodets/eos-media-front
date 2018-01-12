import { Component, OnInit, Input } from '@angular/core';
import {Tweet} from '../tweet';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  @Input() tweet: Tweet;
  
  constructor() { }

  ngOnInit() {
  }

}
