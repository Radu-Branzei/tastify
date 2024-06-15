import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpBarComponent } from './pop-up-bar.component';

describe('PopUpBarComponent', () => {
  let component: PopUpBarComponent;
  let fixture: ComponentFixture<PopUpBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
