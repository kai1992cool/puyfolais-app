import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPuyfolaisComponent } from './edit-puyfolais.component';

describe('AddPuyfolaisComponent', () => {
  let component: EditPuyfolaisComponent;
  let fixture: ComponentFixture<EditPuyfolaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPuyfolaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPuyfolaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
