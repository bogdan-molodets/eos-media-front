import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';
import { EventSatellite } from '../EventSatellite';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  @Input() eventName:string;

  constructor(private mapService: MapService) { }

  images:EventSatellite[];
  ngOnInit() {
    // init compare modal maps
    this.mapService.InitMapModal();
    
    // this.mapService.AddToCompare('http://a.render.eosda.com/S2/11/S/LU/2017/11/30/0/B04,B03,B02/{z}/{x}/{y}','http://a.render.eosda.com/L8/LC08_L1TP_041036_20171202_20171207_01_T1/B4,B3,B2/{z}/{x}/{y}');
    
    this.mapService.getSatelliteImages(7).subscribe(res=>{

      let arr=[]
      for(let i=0;i<res['results'].length;i++){
        let es=new EventSatellite();
        es.id=res['results'][i].id;
        es.date=res['results'][i].date;
        es.tileCenter_lat=res['results'][i].tileCenter_lat;
        es.tileCenter_lon=res['results'][i].tileCenter_lon;
        es.cloudCoverage=res['results'][i].cloudCoverage;
        es.satelliteName=res['results'][i].satelliteName;
        es.satellite_full=this.mapService.MakeTileUrl(res['results'][i]);

        arr.push(es);
      }
      this.images=arr;
      arr=[];
      this.images[0].satellite_full='http://a.render.eosda.com/S2/11/S/LU/2017/11/30/0/B04,B03,B02/{z}/{x}/{y}';
      this.images[1].satellite_full=  'http://a.render.eosda.com/L8/LC08_L1TP_041036_20171202_20171207_01_T1/B4,B3,B2/{z}/{x}/{y}';
      this.mapService.AddToCompare(this.images[0].satellite_full,this.images[1].satellite_full);
    });
   

  }

  hideCompare(){
    this.mapService.setCompare(false);
  }
}
