import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainListComponent } from './main-list.component';

describe('MainListComponent', () => {
  let component: MainListComponent;
  let fixture: ComponentFixture<MainListComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
