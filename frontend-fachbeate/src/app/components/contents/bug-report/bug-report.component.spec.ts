import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportComponent } from './bug-report.component';

describe('BugReportComponent', () => {
  let component: BugReportComponent;
  let fixture: ComponentFixture<BugReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BugReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
