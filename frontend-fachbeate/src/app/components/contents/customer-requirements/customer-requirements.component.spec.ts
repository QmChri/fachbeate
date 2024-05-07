import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRequirementsComponent } from './customer-requirements.component';

describe('CustomerRequirementsComponent', () => {
  let component: CustomerRequirementsComponent;
  let fixture: ComponentFixture<CustomerRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRequirementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
