import {Injectable} from '@angular/core';
import {Event} from '../event';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class MapService{
    public zoom = new BehaviorSubject<number>(5);
    public long = new BehaviorSubject<number>(5);
    public lat = new BehaviorSubject<number>(45);
    
    constructor(){}

    public OnEventClick(event:Event){
        this.SetParams(event);
    }

    public OnPointClick(event:Event){
        this.SetParams(event);
    }

    public GetZoom(): Observable<number>{
        return this.zoom.asObservable();
    }

    public GetLong(): Observable<number>{
        return this.long.asObservable();
    }

    public GetLat(): Observable<number>{
        return this.lat.asObservable();
    }

    private SetParams(event:Event){
        this.zoom.next(6);
        this.lat.next(event.event_lat);
        this.long.next(event.event_lon);
    }
}
