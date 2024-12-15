import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultercalendarComponent } from './consultercalendar.component';

describe('ConsultercalendarComponent', () => {
  let component: ConsultercalendarComponent;
  let fixture: ComponentFixture<ConsultercalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultercalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultercalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
