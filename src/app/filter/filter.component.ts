import { Component, OnInit, Input, OnChanges, Directive, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Input() event_types: string[];
  @Input() active_types: string[];
  @Input() title: string;
  //checked_event_types: string[] = this.event_types;
 
  
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

  CheckType(e:any, event_type:string):any{
    //console.log(this.active_types);
    if(this.active_types.indexOf(event_type)!==-1){
      console.log('exist');
      this.active_types.splice(this.active_types.indexOf(event_type),1);
    }else{
      console.log('doesnt exist');
      this.active_types.push(event_type);
    }
    //console.log(this.active_types);
    this.changeActiveTypes.emit(this.active_types);
  }

  CheckTitle(e:any, title:string):any{
    //console.log(title);
    this.title = title;
    this.isVisible = false;
    this.changeTitle.emit(this.title);
  }
}
