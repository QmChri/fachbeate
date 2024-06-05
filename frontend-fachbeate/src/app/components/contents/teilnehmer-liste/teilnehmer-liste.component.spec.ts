import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilnehmerListeComponent } from './teilnehmer-liste.component';

describe('TeilnehmerListeComponent', () => {
  let component: TeilnehmerListeComponent;
  let fixture: ComponentFixture<TeilnehmerListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeilnehmerListeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeilnehmerListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
