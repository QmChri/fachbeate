import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequestComponent } from './booking-request.component';

describe('BookingRequestComponent', () => {
  let component: BookingRequestComponent;
  let fixture: ComponentFixture<BookingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
