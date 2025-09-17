import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeComakerDialogComponent } from './change-comaker-dialog.component';

describe('ChangeComakerDialogComponent', () => {
  let component: ChangeComakerDialogComponent;
  let fixture: ComponentFixture<ChangeComakerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeComakerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeComakerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
