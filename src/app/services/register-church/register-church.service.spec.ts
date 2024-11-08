import { TestBed } from '@angular/core/testing';

import { RegisterChurchService } from './register-church.service';

describe('RegosterChurchService', () => {
  let service: RegisterChurchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterChurchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
