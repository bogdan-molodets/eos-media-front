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
  currentImage: any;
  rightImage: any;
  leftImage: any;
  dragActiveLeft:boolean = false;
  dragActiveRight:boolean = false;
  public carouselOne: NgxCarousel;

  constructor(private mapService: MapService) { }

  images:any[];
  ngOnInit() {
    
    // init compare modal maps
     this.mapService.InitMapModal();
     this.mapService.currentEvent.subscribe(event => {
      try {
        
        this.mapService.getSatelliteImagesCompare(event.id).subscribe(res=>{
          
          // check if results empty
          if (res['results'] && res['results'].length > 1) {
            this.leftImage = res['results'][0];
            this.rightImage = res['results'][1];            
            this.mapService.AddToCompare(this.leftImage, this.rightImage);
            }else{         
              // if no res delete previous rasters
              this.mapService.ClearMaps();
            }
        
          
        });

        this.mapService.getSatelliteImages(event.id).subscribe(res => {
          this.next_page = res['next'];         
          this.images = Object.values(res['results']);      
          
        });
      } catch (e) {
      }
    });
     
    //carousel init
    this.carouselOne = {
      grid: {xs: 1, sm: 2, md: 4, lg: 8, all: 0},
      slide: 1,
      speed: 400,
      animation: 'lazy',
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      easing: 'ease'
    }

  }

  dragOver(event, side){
    event.preventDefault();
    console.log('dragOver');
  }

  dropImage(event, side){
    event.preventDefault();
    console.log('drop image to compare');
    console.log(this.currentImage);
    switch(side){
      case 'left':{
        this.leftImage = this.currentImage;
        break;
      }
      case 'right':{
        this.rightImage = this.currentImage;
        break;
      }
      default:{
        break;
      }
    }
    this.mapService.AddToCompare(this.leftImage, this.rightImage);
    this.dragActiveRight = false;
    this.dragActiveLeft = false;
  }

  dragLeave(event,side){
    console.log(`you left ${side} side`);
  }

  dragStart(event, image){
    console.log('drop start');
    this.currentImage = image;
    this.dragActiveRight = true;
    this.dragActiveLeft = true;
  }

  dragEnd(event){
    console.log('drag end');
    console.log(event);
    this.dragActiveRight = false;
    this.dragActiveLeft = false;

  }

  public myfunc(event: Event) {}
  
  hideCompare(){
   
   
    this.mapService.setCompare(false);
  }
}
