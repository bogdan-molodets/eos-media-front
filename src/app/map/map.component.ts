import { Component, OnInit, Input} from '@angular/core';
import { Events } from '../mock-events';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

 

export class MapComponent implements OnInit {
	
	@Input() events = Events;
	/*@Input() zoom = 3;
	@Input() latitude = 39.333510;
	@Input() longtitude = -101.412416;
	current_marker(lat:number,long:number):void{
		console.log('Choose current marker');
		this.zoom = 8;
		this.latitude  = lat;
		this.longtitude = long;
		console.log(this.zoom);
  	}
  	zoomChange(zoom:number):void{
  		this.zoom = zoom;
  		console.log(zoom);
  	}*/
  	constructor() { }
  	
  	ngOnInit() {
  		
  	}

}
