import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModuleComponent } from './edit-module.component';

describe('EditModuleComponent', () => {
  let component: EditModuleComponent;
  let fixture: ComponentFixture<EditModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
