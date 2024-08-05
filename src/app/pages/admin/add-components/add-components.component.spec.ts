import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponentsComponent } from './add-components.component';

describe('AddComponentsComponent', () => {
  let component: AddComponentsComponent;
  let fixture: ComponentFixture<AddComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddComponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
