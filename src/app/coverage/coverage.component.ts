import { Component, OnInit,AfterViewInit, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Tweet} from '../tweet';
import {Tweets} from '../tweets';
import { EventsService } from '../services/events.service';
import { TweetService } from '../services/tweet.service';
import { MapService} from '../services/map.service';
import { error } from 'util';
declare const twttr: any;

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit, AfterViewInit {  
  tweets: Tweets[];
  tweet: Tweets;
  html: String[];
  private twitter: any
  private callback:{():void};
  public tweet_articles: String[];
  //id: number;

  constructor(private eventService: EventsService, private tweetService: TweetService, private twitterEl: ElementRef, private mapService: MapService) {
    
   
    }
  

  ngOnInit() {
    this.mapService.currentEvent.subscribe(event => {
      try {
        this.tweetService.getTweetsByEventId(event.id).subscribe(tweets=>{
          this.tweet_articles = Object.values(tweets);
          
        })
      } catch (e) {
        this.tweet_articles=[];
       
      }
    });
    
  }
 


  ngAfterViewInit()	{
    twttr.ready(() => {
      console.log('twttr load', twttr);
      twttr.widgets.load(this.twitterEl.nativeElement);
    });
	
  }

  
  getTweetsByEventId(id:number):void{
    this.tweetService.getTweetsByEventId(id).subscribe(tweets => {
      this.tweets = tweets;
      
    });
  }

 



  /**textParse(tweet:Tweet):Tweet{
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
  }**/
  
  
}
