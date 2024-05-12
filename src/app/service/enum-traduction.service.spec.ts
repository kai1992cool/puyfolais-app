import { TestBed } from '@angular/core/testing';

import { EnumTraductionService } from './enum-traduction.service';

describe('EnumTraductionService', () => {
  let service: EnumTraductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnumTraductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
