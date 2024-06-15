import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningInfoPageComponent } from './listening-info-page.component';

describe('ListeningInfoPageComponent', () => {
  let component: ListeningInfoPageComponent;
  let fixture: ComponentFixture<ListeningInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeningInfoPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeningInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
