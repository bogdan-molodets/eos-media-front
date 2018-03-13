import { Component, OnInit, Input, OnChanges, Directive, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() isVisible = false;
  @Input() event_types: string[];
  @Input() active_types: string[];
  @Input() title: string;
  // checked_event_types: string[] = this.event_types;


  @Output()
  changeActiveTypes: EventEmitter<string[]> = new EventEmitter();
  @Output()
  changeTitle: EventEmitter<string> = new EventEmitter();
  /*change_event_types(types:string[]) {
    this.active_types = types;
    this.change.emit(this.active_types);
  }*/

  constructor() { }

  ngOnInit() {
  }

  CheckType(e: any, event_type: string): any {
    if (this.active_types.indexOf(event_type) !== -1) {
      this.active_types.splice(this.active_types.indexOf(event_type), 1);
    }else {
      this.active_types.push(event_type);
    }
    this.changeActiveTypes.emit(this.active_types);
  }

  CheckTitle(e: any, title: string): any {
    this.title = title;
    this.changeTitle.emit(this.title);
  }
}
