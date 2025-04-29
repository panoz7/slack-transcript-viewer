import { TestBed } from '@angular/core/testing';

import { ZipServiceService } from './zip-service.service';

describe('ZipServiceService', () => {
  let service: ZipServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZipServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
