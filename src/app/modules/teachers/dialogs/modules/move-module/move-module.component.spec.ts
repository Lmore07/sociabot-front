import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveModuleComponent } from './move-module.component';

describe('MoveModuleComponent', () => {
  let component: MoveModuleComponent;
  let fixture: ComponentFixture<MoveModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
