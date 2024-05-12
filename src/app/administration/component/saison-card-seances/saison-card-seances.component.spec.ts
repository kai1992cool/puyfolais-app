import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisonCardSeancesComponent } from './saison-card-seances.component';

describe('SaisonCardSeancesComponent', () => {
  let component: SaisonCardSeancesComponent;
  let fixture: ComponentFixture<SaisonCardSeancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisonCardSeancesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaisonCardSeancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
