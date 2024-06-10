import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDealerComponent } from './create-dealer.component';

describe('CreateDealerComponent', () => {
  let component: CreateDealerComponent;
  let fixture: ComponentFixture<CreateDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
