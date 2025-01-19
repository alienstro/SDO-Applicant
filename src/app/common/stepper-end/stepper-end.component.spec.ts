import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperEndComponent } from './stepper-end.component';

describe('StepperEndComponent', () => {
  let component: StepperEndComponent;
  let fixture: ComponentFixture<StepperEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperEndComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepperEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
