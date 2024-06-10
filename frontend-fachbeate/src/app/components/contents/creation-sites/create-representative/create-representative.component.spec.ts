import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRepresentativeComponent } from './create-representative.component';

describe('CreateRepresentativeComponent', () => {
  let component: CreateRepresentativeComponent;
  let fixture: ComponentFixture<CreateRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRepresentativeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
