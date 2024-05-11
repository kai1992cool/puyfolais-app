import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisonDialogComponent } from './saison-dialog.component';

describe('SaisonDialogComponent', () => {
  let component: SaisonDialogComponent;
  let fixture: ComponentFixture<SaisonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisonDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaisonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
