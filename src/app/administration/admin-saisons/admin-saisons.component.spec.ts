import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSaisonsComponent } from './admin-saisons.component';

describe('AdminSaisonsComponent', () => {
  let component: AdminSaisonsComponent;
  let fixture: ComponentFixture<AdminSaisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSaisonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSaisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
