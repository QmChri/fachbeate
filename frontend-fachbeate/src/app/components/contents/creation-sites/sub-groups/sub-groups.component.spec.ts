import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubGroupsComponent } from './sub-groups.component';

describe('SubGroupsComponent', () => {
  let component: SubGroupsComponent;
  let fixture: ComponentFixture<SubGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
