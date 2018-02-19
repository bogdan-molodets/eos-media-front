import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { Event } from '../event';
import { EventSatellite } from '../EventSatellite';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  @Input() event: Event; 
  next_page: string;
  constructor(private mapService: MapService) { }

  images:EventSatellite[];
  ngOnInit() {
   
    // init compare modal maps
     this.mapService.InitMapModal();
     this.mapService.currentEvent.subscribe(event => {
      try {
        
        this.mapService.getSatelliteImages(event.id).subscribe(res => {
          //this.next_page = res['next'];
    console.log(res);
          res = Object.values(res['results']);
    
          if (res.length !== 0) {
            this.mapService.AddToCompare(res[0], res[4]);
          }
          
        });
      } catch (e) {
      }
    });
     
   

  }

  hideCompare(){
   // this.mapService.AddToCompare('http://a.render.eosda.com/S2/11/S/LU/2017/11/30/0/B04,B03,B02/{z}/{x}/{y}','http://a.render.eosda.com/L8/LC08_L1TP_041036_20171202_20171207_01_T1/B4,B3,B2/{z}/{x}/{y}');
   
    this.mapService.setCompare(false);
  }
}
