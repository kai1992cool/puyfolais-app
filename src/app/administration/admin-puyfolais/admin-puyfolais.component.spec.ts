import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPuyfolaisComponent } from './admin-puyfolais.component';

describe('AdminPuyfolaisComponent', () => {
  let component: AdminPuyfolaisComponent;
  let fixture: ComponentFixture<AdminPuyfolaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPuyfolaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPuyfolaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
