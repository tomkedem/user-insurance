import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFromComponent } from './popup-from.component';

describe('PopupFromComponent', () => {
  let component: PopupFromComponent;
  let fixture: ComponentFixture<PopupFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupFromComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
