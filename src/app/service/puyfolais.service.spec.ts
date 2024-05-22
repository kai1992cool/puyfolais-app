import { TestBed } from '@angular/core/testing';

import { PuyfolaisService } from './puyfolais.service';

describe('PuyfolaisService', () => {
  let service: PuyfolaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuyfolaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
