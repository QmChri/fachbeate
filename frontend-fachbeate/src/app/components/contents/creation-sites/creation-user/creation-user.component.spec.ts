import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatMailUserComponent } from './creation-user.component';

describe('CreatMailUserComponent', () => {
  let component: CreatMailUserComponent;
  let fixture: ComponentFixture<CreatMailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatMailUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatMailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
