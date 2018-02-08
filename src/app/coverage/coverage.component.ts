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
import { forEach } from '@angular/router/src/utils/collection';


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
  public tweet_articles: String[];
  selectedTab = 'twitter';
  test = '';
  // id: number;

  constructor(private newsService: NewsService, private tweetService: TweetService, private twitterEl: ElementRef, private mapService: MapService) {


  }


  ngOnInit() {

    this.mapService.currentEvent.subscribe(event => {
      try {
        // get news and tweets for event
        this.twittInit();
        this.getNewsByEventId(event.id);
        this.getTweetsByEventId(event.id);

      } catch (e) {
        // if no event make empty
        this.tweet_articles = [];
        this.news = [];
      }
    });


  }

  setActiveTab(tab: string){
    this.selectedTab = tab;
  }

  twittInit(){

    const twit = setInterval(function(){
      if (twttr.ready()){
        twttr.widgets.load(document.getElementById('twitter'));
      }
    }, 4);
    setTimeout(function(){
      clearInterval(twit);
      
    }, 10000);
  }
  ngAfterViewInit() {


    // twttr.ready(() => {
    //   console.log('twttr load', twttr);
    //   twttr.widgets.load(document.getElementById('twitter'));
    // });
  }


  getTweetsByEventId(id: number): void {
    this.tweetService.getTweetsByEventId(id).subscribe(tweets => {
     // this.test = Object.values(tweets).join('');//.replace(new RegExp('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>','g') ,'');



      this.tweet_articles = Object.values(tweets);
    });
  }


  getNewsByEventId(id: number): void {
    this.newsService.getNewsByEventId(id).subscribe(news => {
      this.news = Object.values(news);

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
