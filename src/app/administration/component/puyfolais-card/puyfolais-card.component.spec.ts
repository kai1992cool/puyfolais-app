import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuyfolaisCardComponent } from './puyfolais-card.component';

describe('PuyfolaisCardComponent', () => {
  let component: PuyfolaisCardComponent;
  let fixture: ComponentFixture<PuyfolaisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuyfolaisCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuyfolaisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
