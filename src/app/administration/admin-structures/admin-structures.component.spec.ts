import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStructuresComponent } from './admin-structures.component';

describe('AdminStructuresComponent', () => {
  let component: AdminStructuresComponent;
  let fixture: ComponentFixture<AdminStructuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStructuresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
