import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeDialogComponent } from './groupe-dialog.component';

describe('GroupeDialogComponent', () => {
  let component: GroupeDialogComponent;
  let fixture: ComponentFixture<GroupeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
