import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { Event } from '../event';
import { EventSatellite } from '../EventSatellite';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  @Input() event: Event; 
  next_page: string;
  public carouselOne: NgxCarousel;

  constructor(private mapService: MapService) { }

  images:any[];
  ngOnInit() {
    //carousel init
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 8, lg: 8, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: false,
      custom: 'banner'
    }
    // init compare modal maps
     this.mapService.InitMapModal();
     this.mapService.currentEvent.subscribe(event => {
      try {
        
        this.mapService.getSatelliteImagesCompare(event.id).subscribe(res=>{
      
          // check if results empty
          if (res['results'] && res['results'].length > 1) {            
            this.mapService.AddToCompare(res['results'][0], res['results'][1]);
            }else{         
              // if no res delete previous rasters
              this.mapService.ClearMaps();
            }
        
          
        });

        this.mapService.getSatelliteImages(event.id).subscribe(res => {
          this.next_page = res['next'];         
          res = Object.values(res['results']);      
          
        });
      } catch (e) {
      }
    });
     
   

  }

  public myfunc(event: Event) {}
  
  hideCompare(){
   // this.mapService.AddToCompare('http://a.render.eosda.com/S2/11/S/LU/2017/11/30/0/B04,B03,B02/{z}/{x}/{y}','http://a.render.eosda.com/L8/LC08_L1TP_041036_20171202_20171207_01_T1/B4,B3,B2/{z}/{x}/{y}');
   
    this.mapService.setCompare(false);
  }
}
