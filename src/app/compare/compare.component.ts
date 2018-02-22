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
          this.images = Object.values(res['results']).map(this.mapService.changeHttp);      
          
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
      loop: false,
      easing: 'ease'
    }

  }
  /**
   * Event when you set drop target
   * @param event 
   * @param side - focused side
   */
  dragOver(event, side){
    event.preventDefault();
  }

  /**
   * Drop image event, checked focused side and change image
   * @param event 
   * @param side - focused side 
   */
  dropImage(event, side){
    event.preventDefault();
    switch(side){
      case 'left':{
        this.leftImage = this.currentImage;
        this.mapService.AddToCompare(this.leftImage, this.rightImage);
        break;
      }
      case 'right':{
        this.rightImage = this.currentImage;
        this.mapService.AddToCompare(this.leftImage, this.rightImage);
        break;
      }
      default:{
        break;
      }
    }
    this.dragActiveRight = false;
    this.dragActiveLeft = false;
  }

  /**
   * drag start event listener, set drag image, set drag blur 
   * @param event 
   * @param image - current drag variable
   */
  dragStart(event, image){
    this.currentImage = image;
    this.dragActiveRight = true;
    this.dragActiveLeft = true;
  }

  public myfunc(event: Event) {}
  
  /** Hide compare after button click**/
  hideCompare(){
    this.dragActiveRight = false;
    this.dragActiveLeft = false;
    this.mapService.setCompare(false);
  }
}
