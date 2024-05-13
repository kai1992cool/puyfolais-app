import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceCardComponent } from './seance-card.component';

describe('SeanceCardComponent', () => {
  let component: SeanceCardComponent;
  let fixture: ComponentFixture<SeanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeanceCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
