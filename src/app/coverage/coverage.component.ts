import { Component, OnInit,AfterViewInit, ElementRef } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Tweet} from '../tweet';
import {Tweets} from '../tweets';
import { EventsService } from '../services/events.service';
import { TweetService } from '../services/tweet.service';
import { MapService} from '../services/map.service';
import { error } from 'util';
//import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
//import { Router, NavigationEnd } from '@angular/router';
//import {HttpClient, HttpHeaders} from '@angular/common/http';

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
  private tweet_articles: String[];
  //id: number;

  constructor(private eventService: EventsService, private tweetService: TweetService, private element: ElementRef, private mapService: MapService) {

    //this.tw_init();
    /*this.twitter = new Observable(observer=>{
      observer.next();
      observer.complete();
    });*/
    //this.callback = () => this.getTweets();
    }
  

  ngOnInit() {
    this.mapService.currentEvent.subscribe(event => {
      try {
        //this.id = event.id;
        console.log(event.id);
        this.tweetService.getTweetsByEventId(event.id).subscribe(tweets=>{
          this.tweet_articles = Object.values(tweets);
        })
      } catch (e) {
      }
    });
    //this.getTweetsByEventId(16);
    //this.getTweets();
    /*let sub = this.twitter.subscribe(value=>{
      console.log(value);
      this.getTweets();
      //
    },error=>{
      console.log('Error');
    })*/
    //this.tw_init()
  }
 
  private tw_init(): void{
    
    (<any>window).twttr = (function (d, s, id) {
      let js: any, fjs = d.getElementsByTagName(s)[0],
          t = (<any>window).twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f: any) {
          t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs"));
    
    
    setInterval(
    function(){if ((<any>window).twttr.ready()){
      console.log((<any>window).twttr);
      (<any>window).twttr.widgets.load(document.getElementById('twitter'));
    }else{
      console.log('error');
    }},5000);
    //this.callback();
    /*this.createScript().subscribe(twttr=>{
      if(twttr.ready()){
        console.log((<any>window).twttr);
        (<any>window).twttr.widgets.load(document.getElementById("twitter"));
      }
    });*/
  };

  widget_load(){
    
  }
  /*createScript (): Observable<any>{
    return ((<any>window).twttr = (function (d, s, id) {
      let js: any, fjs = d.getElementsByTagName(s)[0],
          t = (<any>window).twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f: any) {
          t._e.push(f);
      };

      return t;
    }(document, "script", "twitter-wjs")))  
  }*/


  ngAfterViewInit()	{
				this.tw_init();			
  }

  /**The Last working version**/

  /*getTweets(): void {
    this.eventService.getTweets().subscribe(tweets => this.tweets = tweets.map(this.textParse));
  }*/
  
  getTweetsByEventId(id:number):void{
    this.tweetService.getTweetsByEventId(id).subscribe(tweets => {
      this.tweets = tweets;
      
    });
  }

  /*getTweets(): void {
    this.tweetService.getTweets().subscribe(tweets => {
      this.tweets = tweets;
     // console.log(this.tweets);
      for(let i = 0; i<this.tweets.length; i++){
        this.tweetService.getTweetsById(this.tweets[i]['tweet_real_id']).subscribe(res =>{
          //console.log(res);
        });
      }
    });
  }*/


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
