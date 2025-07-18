import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComakerDialogComponent } from './comaker-dialog.component';

describe('ComakerDialogComponent', () => {
  let component: ComakerDialogComponent;
  let fixture: ComponentFixture<ComakerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComakerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComakerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
