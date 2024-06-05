import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbschlussBerichtListComponent } from './abschluss-bericht-list.component';

describe('MainListComponent', () => {
  let component: AbschlussBerichtListComponent;
  let fixture: ComponentFixture<AbschlussBerichtListComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AbschlussBerichtListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AbschlussBerichtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
