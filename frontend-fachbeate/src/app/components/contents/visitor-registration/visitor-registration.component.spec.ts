import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorRegistrationComponent } from './visitor-registration.component';

describe('VisitorRegistrationComponent', () => {
  let component: VisitorRegistrationComponent;
  let fixture: ComponentFixture<VisitorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
