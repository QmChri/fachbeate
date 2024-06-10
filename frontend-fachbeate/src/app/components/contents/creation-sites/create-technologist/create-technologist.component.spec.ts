import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTechnologistComponent } from './create-technologist.component';

describe('CreateTechnologistComponent', () => {
  let component: CreateTechnologistComponent;
  let fixture: ComponentFixture<CreateTechnologistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTechnologistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTechnologistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
