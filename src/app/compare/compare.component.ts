import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  @Input() eventName:string;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    
  }

  hideCompare(){
    this.mapService.setCompare(false);
  }
}
