import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCompteComponent } from './manage-compte.component';

describe('ManageCompteComponent', () => {
  let component: ManageCompteComponent;
  let fixture: ComponentFixture<ManageCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
