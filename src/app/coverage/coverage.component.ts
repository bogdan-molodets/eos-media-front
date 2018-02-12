import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Tweet } from '../tweet';
import { Tweets } from '../tweets';
import { EventsService } from '../services/events.service';
import { TweetService } from '../services/tweet.service';
import { MapService } from '../services/map.service';
import { error } from 'util';
import { NewsService } from '../services/news.service';
import { News } from '../news';



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
  news: News[];
  private twitter: any;
  private callback: () => void;
 
  selectedTab = 'twitter';

  timer = false;
  

  constructor(private newsService: NewsService, private tweetService: TweetService, private twitterEl: ElementRef, private mapService: MapService) {


  }


  ngOnInit() {

    this.mapService.currentEvent.subscribe(event => {
      try {
        // get news and tweets for event
       
        this.getNewsByEventId(event.id);
       
        this.getTweets(event.id);
      } catch (e) {
        // if no event make empty
      
        this.news = [];
        this.emptyCoverage();
      
      }
    });


  }

  setActiveTab(tab: string) {
    this.selectedTab = tab;
  }


  /**
   * remove all child elements from div
   */
  emptyCoverage(){
    var elem=document.getElementById('twitter-card');
    while(elem.firstChild){
      elem.removeChild(elem.firstChild);
    }
  }

  
  ngAfterViewInit() {



  }


 


  getNewsByEventId(id: number): void {
    this.newsService.getNewsByEventId(id).subscribe(news => {
      this.news = Object.values(news);

    });
  }

  getTweets(id: number): void {
    this.tweetService.getTweetsIdsByEventId(id).subscribe(ids => {
     
      //remove all child nodes
      this.emptyCoverage();
     
      for (let i = 0; i < ids.length; i++) {
       
        twttr.widgets.createTweet(
          ids[i].tweet_real_id,
          document.getElementById('twitter-card'),
          {
           
            align: 'left'
            
          })
          .then(function (el) {
           // console.log("Tweet displayed.")
          });
        
      }
      
    }
    );
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
