import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObscurityPageComponent } from './obscurity-page.component';

describe('ObscurityPageComponent', () => {
  let component: ObscurityPageComponent;
  let fixture: ComponentFixture<ObscurityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObscurityPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObscurityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
