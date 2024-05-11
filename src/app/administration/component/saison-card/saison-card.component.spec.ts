import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisonCardComponent } from './saison-card.component';

describe('SaisonCardComponent', () => {
  let component: SaisonCardComponent;
  let fixture: ComponentFixture<SaisonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisonCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaisonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
