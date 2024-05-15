import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbschlussBerichtComponent } from './abschluss-bericht.component';

describe('AbschlussBerichtComponent', () => {
  let component: AbschlussBerichtComponent;
  let fixture: ComponentFixture<AbschlussBerichtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbschlussBerichtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbschlussBerichtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
