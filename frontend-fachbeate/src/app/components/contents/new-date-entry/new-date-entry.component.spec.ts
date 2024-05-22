import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDateEntryComponent } from './new-date-entry.component';

describe('NewDateEntryComponent', () => {
  let component: NewDateEntryComponent;
  let fixture: ComponentFixture<NewDateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDateEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
