import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  activeBar: string;

  constructor() { }

  ngOnInit() {
  }

  setActiveBar(active:string){
    if(this.activeBar === active){
      this.activeBar = '';
    }else{
      this.activeBar = active;
    }    
  }

}
