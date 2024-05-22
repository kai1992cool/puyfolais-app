import { TestBed } from '@angular/core/testing';

import { DataGouvService } from './data-gouv.service';

describe('DataGouvService', () => {
  let service: DataGouvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataGouvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
