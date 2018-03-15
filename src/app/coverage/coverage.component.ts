import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Tweet } from '../tweet';
import { Tweets } from '../tweets';
import { EventsService } from '../services/events.service';
import { TweetService } from '../services/tweet.service';
import { MapService } from '../services/map.service';
import { error } from 'util';
import { NewsService } from '../services/news.service';
import { News } from '../news';
import { PhotosService } from '../services/photos.service';
import { Photo } from '../photo';


declare const twttr: any;

@Component({
  selector: 'app-coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})
export class CoverageComponent implements OnInit {
  tweets: Tweets[];
  tweet: Tweets;
  html: String[];
  news: any;
  photos: Photo[];
  ids: any[];
  // next_page_tweets = 'https://media-test-service.herokuapp.com/tweets/?page=1';
  // next_page_photos = 'https://media-test-service.herokuapp.com/photos/?page=1';
  // next_page_news = 'https://media-test-service.herokuapp.com/news/?page=1';
  // event_null= false;
  private twitter: any;
  private callback: () => void;

  next_page: string = null;

  selectedTab = 'twitter';

  timer = false;


  constructor(private newsService: NewsService, private tweetService: TweetService, private twitterEl: ElementRef, private mapService: MapService, private photosService: PhotosService) {


  }

  @HostListener('scroll', ['$event'])
  onScroll(e) {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight;
    if (bottom === 0 && this.next_page !== null && this.selectedTab === 'twitter') {
      this.getTweets(0, this.next_page);
    }/*else if(this.event_null){
      switch(this.selectedTab){
        case 'twitter':
          if (bottom === 0 && this.next_page_tweets !== null){
            this.getAllTweets(this.next_page_tweets);
          } 
          break;
        case 'news':
          if (bottom === 0 && this.next_page_news !== null){
            this.getAllNews(this.next_page_news);
          } 
          break;
        case 'photos':
          if (bottom === 0 && this.next_page_photos !== null){
            this.getAllPhotos(this.next_page_photos);
          } 
          break;
        default: 
          break;
      }
    }*/
  }

  ngOnInit() {

    this.mapService.currentEvent.subscribe(event => {
      try {
        // get news and tweets for event
        //this.event_null = false;
        this.getNewsByEventId(event.id);

        // remove all child nodes
        this.emptyCoverage();

        this.getTweets(event.id, null);
        this.getPhotosByEventId(event.id);
      } catch (e) {
        // if no event make empty
        //this.event_null = true;
        this.news = [];
        this.emptyCoverage();
        this.photos = [];
        /*this.getAllTweets(this.next_page_tweets);
        this.getAllNews(this.next_page_news);
        this.getAllPhotos(this.next_page_photos);*/
      }
    });


  }

  setActiveTab(tab: string) {
    this.selectedTab = tab;
  }


  /**
   * remove all child elements from div
   */
  emptyCoverage() {
    const elem = document.getElementById('twitter-card');
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

/*
  getAllTweets(url:any){
    this.tweetService.getTweets(url).subscribe(res=>{
      this.next_page_tweets = res['next'];
      this.ids = res['results'];
      for (let i = 0; i < this.ids.length; i++) {

        twttr.widgets.createTweet(
          this.ids[i].tweet_real_id,
          document.getElementById('twitter-card'),
          {

            align: 'center'

          })
          .then(function (el) {
          });

      }
    });
  }
  getAllPhotos(url:any){
    this.photosService.getPhotos(url).subscribe(res=>{
      this.next_page_photos = res['next'];
      this.photos = this.photos.concat(res['results']);
    });
  }
  getAllNews(url:any){
    this.newsService.getNews(url).subscribe(res=>{
      this.next_page_news = res['next'];
      this.news = this.news.concat(res['results']);
    });
  }*/



  getNewsByEventId(id: number): void {
    this.newsService.getNewsByEventId(id).subscribe(news => {
      this.news = Object.values(news);
      // change url of image( http to https)
      this.news.map((article) => {
        article['urlToImage'] = article['urlToImage'].replace('http:', 'https:');
      });
    });
  }

  getPhotosByEventId(id: number): void {
    this.photosService.getPhotosByEventId(id).subscribe(photos => {

      this.photos = Object.values(photos);


    });
  }

  getTweets(id: number, next_page: string): void {
    this.tweetService.getTweetsIdsByEventId(id, next_page).subscribe(ids => {

      this.next_page = ids['next'];
      this.ids = ids['results'];
      for (let i = 0; i < this.ids.length; i++) {

        twttr.widgets.createTweet(
          this.ids[i].tweet_real_id,
          document.getElementById('twitter-card'),
          {

            align: 'center'

          })
          .then(function (el) {
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
