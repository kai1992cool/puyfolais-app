import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisonEditCardComponent } from './saison-edit-card.component';

describe('SaisonEditCardComponent', () => {
  let component: SaisonEditCardComponent;
  let fixture: ComponentFixture<SaisonEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisonEditCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaisonEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
