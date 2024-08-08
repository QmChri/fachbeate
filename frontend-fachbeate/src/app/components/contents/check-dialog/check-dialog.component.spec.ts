import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDialogComponent } from './check-dialog.component';

describe('CheckDialogComponent', () => {
  let component: CheckDialogComponent;
  let fixture: ComponentFixture<CheckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
