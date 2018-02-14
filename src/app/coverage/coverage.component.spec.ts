import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageComponent } from './coverage.component';
import { MapService } from '../services/map.service';
import { TweetService } from '../services/tweet.service';
import { NewsService } from '../services/news.service';

describe('CoverageComponent', () => {
  let component: CoverageComponent;
  let fixture: ComponentFixture<CoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverageComponent ],
      providers: [MapService, TweetService, NewsService]
    }).compileComponents();


  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
