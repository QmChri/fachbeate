import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtcDateInterceptorComponent } from './utc-date-interceptor.component';

describe('UtcDateInterceptorComponent', () => {
  let component: UtcDateInterceptorComponent;
  let fixture: ComponentFixture<UtcDateInterceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtcDateInterceptorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtcDateInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
