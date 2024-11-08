import { TestBed } from '@angular/core/testing';

import { RegosterChurchService } from './regoster-church.service';

describe('RegosterChurchService', () => {
  let service: RegosterChurchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegosterChurchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
