import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelreportComponent } from './travelreport.component';

describe('TravelreportComponent', () => {
  let component: TravelreportComponent;
  let fixture: ComponentFixture<TravelreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
