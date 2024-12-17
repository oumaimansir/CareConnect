import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulterUserComponent } from './consulter-user.component';

describe('ConsulterUserComponent', () => {
  let component: ConsulterUserComponent;
  let fixture: ComponentFixture<ConsulterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsulterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
