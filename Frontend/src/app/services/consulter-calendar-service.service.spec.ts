import { TestBed } from '@angular/core/testing';

import { ConsulterCalendarServiceService } from './consulter-calendar-service.service';

describe('ConsulterCalendarServiceService', () => {
  let service: ConsulterCalendarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsulterCalendarServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
