import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleviewComponent } from './titleview.component';

describe('TitleviewComponent', () => {
  let component: TitleviewComponent;
  let fixture: ComponentFixture<TitleviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
