import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuUserComponent } from './side-menu-user.component';

describe('SideMenuUserComponent', () => {
  let component: SideMenuUserComponent;
  let fixture: ComponentFixture<SideMenuUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideMenuUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
