import {Component, OnInit, Input} from '@angular/core';
import {Event} from '../event';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() event: Event;

  constructor() {
  }

  ngOnInit() {
  }

}
