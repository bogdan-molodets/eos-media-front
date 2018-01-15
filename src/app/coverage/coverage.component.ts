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
    this.eventService.getTweets().subscribe(tweets => this.tweets = tweets.map(this.textParse));
  }


  textParse(tweet:Tweet):Tweet{
    let new_text = tweet.tweet_text.split(' ');
    let text = '', i = 0;
    while(i<new_text.length){
      if(new_text[i].charAt(0) == '#' || new_text[i].charAt(0) == '@') {               
        text+=`<span class="blue">`+new_text[i]+`</span>`+' ';
        i++;        
      }else if(new_text[i].indexOf('#')!=-1){
        let str = new_text[i].split('#')
        text+=str[0];
        for(var j = 1; j<str.length; j++){
          text+=`<span class="blue">`+'#'+str[j]+`</span>`;          
        }
        text+=' ';
        i++;       
      }else{
        if(new_text[i].indexOf('https://') == 0 || new_text[i].indexOf('http://') == 0 ){
          text+=`<a class='blue' href='`+new_text[i]+`'>`+new_text[i]+`</a>`+' ';
          i++;  
        }else{
          text+=new_text[i] + ' ';
          i++; 
        }
      }               
    }
    tweet.tweet_text = text;
    return tweet;   
  }
  
 
}
