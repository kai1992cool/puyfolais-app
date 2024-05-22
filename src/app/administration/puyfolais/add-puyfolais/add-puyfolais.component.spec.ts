import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPuyfolaisComponent } from './add-puyfolais.component';

describe('AddPuyfolaisComponent', () => {
  let component: AddPuyfolaisComponent;
  let fixture: ComponentFixture<AddPuyfolaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPuyfolaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPuyfolaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
