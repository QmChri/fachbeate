import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeminarRegistrationComponent } from './seminar-registration.component';

describe('SeminarRegistrationComponent', () => {
  let component: SeminarRegistrationComponent;
  let fixture: ComponentFixture<SeminarRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeminarRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeminarRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
